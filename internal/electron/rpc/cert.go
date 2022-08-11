/*
BrewTheory
Copyright (C) 2022  Joshua Farr

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

package rpc

import (
	"bytes"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"errors"
	"math/big"
	"net"
	"os"
	"path/filepath"
	"time"

	"github.com/shibukawa/configdir"
)

func (rpc *Server) createCertificate() bool {
	now := time.Now()
	notBefore := now.Add(-time.Hour * 24)
	// end of ASN.1 time
	endOfTime := time.Date(2049, 12, 31, 23, 59, 59, 0, time.UTC)
	notAfter := endOfTime // notBefore.Add(365 * 24 * time.Hour)

	host, err := os.Hostname()
	if err != nil {
		rpc.Logger.Warn("Error getting hostname - ", err)
		return false
	}

	ipAddresses := []net.IP{net.ParseIP("127.0.0.1"), net.ParseIP("::1")}
	dnsNames := []string{host}
	if host != "localhost" {
		dnsNames = append(dnsNames, "localhost")
	}

	addIP := func(ipAddr net.IP) {
		for _, ip := range ipAddresses {
			if net.IP.Equal(ip, ipAddr) {
				return
			}
		}
		ipAddresses = append(ipAddresses, ipAddr)
	}

	addrs, err := net.InterfaceAddrs()
	if err != nil {
		rpc.Logger.Warn("error getting interface addresses - ", err)
		return false
	}
	for _, a := range addrs {
		ipAddr, _, err := net.ParseCIDR(a.String())
		if err == nil {
			addIP(ipAddr)
		}
	}

	serialNumberLimit := new(big.Int).Lsh(big.NewInt(1), 128)
	serialNumber, err := rand.Int(rand.Reader, serialNumberLimit)
	if err != nil {
		rpc.Logger.Warn("Error creating serial number - ", err)
		return false
	}

	privKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		rpc.Logger.Warn("Error generating private key - ", err)
		return false
	}

	template := x509.Certificate{
		SerialNumber: serialNumber,
		Subject: pkix.Name{
			Organization: []string{"NoteKeeper.io"},
			CommonName:   host,
		},
		NotBefore:             notBefore,
		NotAfter:              notAfter,
		IsCA:                  true,
		KeyUsage:              x509.KeyUsageKeyEncipherment | x509.KeyUsageDigitalSignature | x509.KeyUsageCertSign,
		BasicConstraintsValid: true,
		DNSNames:              dnsNames,
		IPAddresses:           ipAddresses,
	}

	derBytes, err := x509.CreateCertificate(rand.Reader, &template, &template, &privKey.PublicKey, privKey)
	if err != nil {
		rpc.Logger.Warn("Error creating certificate - ", err)
		return false
	}

	certBuf := &bytes.Buffer{}
	err = pem.Encode(certBuf, &pem.Block{Type: "CERTIFICATE", Bytes: derBytes})
	if err != nil {
		rpc.Logger.Warn("Error encoding certificate - ", err)
		return false
	}

	keyBytes, err := x509.MarshalECPrivateKey(privKey)
	if err != nil {
		rpc.Logger.Warn("Error marshaling key bytes - ", err)
		return false
	}

	keyBuf := &bytes.Buffer{}
	err = pem.Encode(keyBuf, &pem.Block{Type: "EC PRIVATE KEY", Bytes: keyBytes})
	if err != nil {
		rpc.Logger.Warn("Error encoding key - ", err)
		return false
	}

	rpc.Certificate, err = tls.X509KeyPair(certBuf.Bytes(), keyBuf.Bytes())
	if err != nil {
		rpc.Logger.Warn("Error converting certificate - ", err)
		return false
	}

	configDirs := configdir.New("farrcraft", "BrewTheory")
	folders := configDirs.QueryFolders(configdir.Global)
	if _, err := os.Stat(folders[0].Path); errors.Is(err, os.ErrNotExist) {
		rpc.Logger.Debug("Creating missing config directory - ", folders[0].Path)
		err := os.Mkdir(folders[0].Path, os.ModePerm)
		if err != nil {
			rpc.Logger.Error("Error creating config directory - ", err)
			return false
		}
	}
	certPath := filepath.Join(folders[0].Path, "certificate")
	rpc.Logger.Debug("Wrote certificate to: ", certPath)
	err = os.WriteFile(certPath, certBuf.Bytes(), 0600)
	if err != nil {
		rpc.Logger.Warn("Error writing certificate - ", err)
		return false
	}

	return true
}
