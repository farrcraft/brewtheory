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

package electron

import (
	"fmt"
	"os"

	"github.com/farrcraft/brewtheory/internal/electron/rpc"

	"github.com/sirupsen/logrus"
)

// Electron is the main service type
type Electron struct {
	Logger   *logrus.Logger
	RPC      *rpc.Server
	Status   chan string
	Shutdown chan bool
}

// NewElectron creates a new backend object
func NewElectron(logLevel string, logFile string) *Electron {
	backend := &Electron{
		Logger:   logrus.New(),
		Status:   make(chan string),
		Shutdown: make(chan bool),
	}

	backend.Logger.Formatter = &logrus.JSONFormatter{}
	level, err := logrus.ParseLevel(logLevel)
	if err != nil {
		fmt.Println("Invalid log level [", logLevel, "]")
		os.Exit(1)
	}
	backend.Logger.Level = level

	var file *os.File
	file, err = os.OpenFile(logFile, os.O_WRONLY|os.O_APPEND|os.O_CREATE, 0640)
	if err != nil {
		fmt.Println("Unable to open log file [", logFile, "] - ", err)
		os.Exit(1)
	}
	backend.Logger.Out = file

	return backend
}

// Run is called when the application is started
func (service *Electron) Run(servicePort string) {
	service.RPC = rpc.NewServer(service.Logger, service.Status, service.Shutdown)
	//service.RPC.RegisterHandlers(handler.Handlers())
	go service.RPC.Start(servicePort)
	for {
		select {
		case msg := <-service.Status:
			fmt.Println(msg)
		case ok := <-service.Shutdown:
			service.Logger.Info("Shutting down service...")
			service.RPC.Stop()
			if !ok {
				os.Exit(1)
			} else {
				os.Exit(0)
			}
		}
	}
}
