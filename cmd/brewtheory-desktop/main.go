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

package main

import (
	"log"
	"os"

	"github.com/farrcraft/brewtheory/internal/electron"

	"github.com/urfave/cli/v2"
)

func main() {
	var logLevel string
	var logFile string

	app := &cli.App{
		Flags: []cli.Flag{
			&cli.StringFlag{
				Name:        "logfile",
				Value:       "brewtheory.log",
				Usage:       "log file name",
				Destination: &logFile,
			},
		},
		Action: func(cCtx *cli.Context) error {
			backend := electron.NewElectron(logLevel, logFile)
			backend.Logger.Debug("Starting Service...")
			backend.Run()
			return nil
		},
	}

	if err := app.Run(os.Args); err != nil {
		log.Fatal(err)
	}
}
