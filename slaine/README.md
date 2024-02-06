# Slaine

Simulation of an entire computer system, including:
- CPU
- central bus
- main memory
- devices

The CPU is designed to execute instructions defined by a specific architecture. The CPU communicates with the main memory and the devices via the central bus.

## Architecture

In order to simplify integration testing, the CLI client will provide an API that will be used by the simplest possible adapter, so that all features of the VM CLI will be testable without needing to spawn an actual child process.
