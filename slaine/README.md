# Slaine

Simple virtualization system. A virtual machine is a simulation of a computer system, including:
- CPU
- central bus
- devices

The CPU executes instructions defined by a specific architecture. The CPU communicates with the devices via the central bus, which acts as a facade where all devices are represented like addresses of a single big virtual memory.

A hypervisor acts as a shell of the virtual machine, providing means to turn the machine on and off, and to inspect its status.

## Features

- the hypervisor inspects the status of the vm
- the hypervisor turns the vm on and off
- when started, the vm executes the instructions found in the device at the starting memory location
- instructions can read or write to memory locations, this has different effects according to the specific devices loaded at those locations
- different devices can be loaded at different memory segments

## Architecture

In order to simplify integration testing, the CLI client will provide an API that will be used by the simplest possible adapter, so that all features of the VM CLI will be testable without needing to spawn an actual child process.
