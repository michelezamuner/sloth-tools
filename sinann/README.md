# Sinann

Sinann is a computer emulator based on a very simple execution model.

The execution model of Sinann is the single sequential thread with static memory and RISC:

- sequential: the computation is described as a sequential execution of a list of instructions
- single thread: there is only one thread of execution, where a single sequence of instructions are executed
- static memory: there is only a single area of memory where data is read and stored by directly accessing it, so no registers, no stack and no heap
- RISC: only a handful of basic instructions are available

Additionally, the computer supports fixed sized, 5 bytes instructions, with 2 bytes addresses, and one 2-bytes sized accumulator register.

Instruction set:

- `noop`: no operation
- `put 0x1234`: put immediate `0x1234` into the accumulator register
- `read 0x1234`: read 2 bytes of data from memory address `0x1234` into the accumulator
- `write 0x1234`: write accumulator data into memory address `0x1234`
- `add 0x1234`: add accumulator data to data at memory address `0x1234` and store the result into the accumulator
- `sub 0x1234'`: subtract from accumulator data, data at `0x1234`, and store the result into the accumulator
- `jmp 0x1234`: jump execution to instruction at `0x1234`
- `cmp 0x1234`: compare accumulator data with data at `0x1234`, and store result into the accumulator
- `je 0x1234`: jump execution to instruction at `0x1324` if accumulator data contains "equals" result
- `jg 0x1234`: jump execution to instruction at `0x1234` if accumulator data contains "greater than" result
- `jl 0x1234`: jump execution to instruction at `0x1234` if accumulator data contains "less than" result

The execution context is a single program binary that is interpreted by the virtual machine. The program binary contains just a sequence of instructions.

Communication with the underlying virtual machine can be done by writing special data to special memory addresses. This is down to the VM implementation, so it's context-specific.

## Architecture

The computer simulator is composed of a virtual machine executable that can run Sinann instructions.

At the boot the first code that is executed needs to be located at a known place, which would be a ROM containing a bootstrap program. In a more complex scenario, this bootstrap program would then jump to the operating system program located elsewhere.

Thus, at boot the contents of the boot ROM are loaded in memory at a fixed address, where the processor always starts its execution.

Since the processor always fetches another instruction, the virtual machine is designed to be always running, unless explicitly shut down by a special instruction.

The virtual machine itself can be seen as a device, providing an interface any program can talk to. In particular, the virtual machine can be instructed to shut down.
