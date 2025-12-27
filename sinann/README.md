# Sinann

Sinann is a computer emulator based on a very simple execution model.

The execution model of Sinann is the single sequential thread with static memory and RISC:

- sequential: the computation is described as a sequential execution of a list of instructions
- single thread: there is only one thread of execution, where a single sequence of instructions are executed
- static memory: there is only a single area of memory where data is read and stored by directly accessing it, so no registers, no stack and no heap
- RISC: only a handful of basic instructions are available

Additionally, the computer supports fixed sized, 4 bytes instructions, with 2 bytes addresses, and 4 2 bytes registers.

Instruction set:

- `noop 0x?? 0x?? 0x??`: no operation
- `movi 0x01 0x1234`: store into register `0x01` immediate value `0x1234`
- `mov 0x01 0x02 0x??`: store into register `0x01` register `0x02`
- `read 0x01 0x02 0x??`: read two bytes of data into register `0x01` from memory pointed to by register `0x02`
- `write 0x01 0x02 0x??`: write data from register `0x01` into memory pointed to by `0x02`
- `andi 0x01 0x1234`: perform a logical AND between register `0x01` and immediate value `0x1234` and store result to register `0x01`
- `and 0x01 0x02 0x??`: perform a logical AND between register `0x01` and register `0x02'` and store result to register `0x01`
- `ori 0x01 0x1234`: perform a logical OR between register `0x01` and immediate value `0x1234` and store result to register `0x01`
- `or 0x01 0x02 0x??`: perform a logical OR between register `0x01` and register `0x02'` and store result to register `0x01`
- `addi 0x01 0x1234`: add to register `0x01` immediate value `0x1234`, and store result to register `0x01`
- `add 0x01 0x02 0x??`: add to register `0x01` register `0x02`, and store the result into register `0x01`
- `subi 0x01 0x1234`: subtract from register `0x01` immediate value `0x1234`, and store result into register `0x01`
- `sub 0x01 0x02 0x??`: subtract from register `0x01` register `0x02`, and store the result into register `0x01`
- `jmpi 0x1234 0x??`: jump execution to instruction at immediate address `0x1234`
- `jmp 0x01 0x?? 0x??`: jump execution to instruction pointed to by register `0x01`
- `cmpi 0x01 0x1234`: compare register `0x01` with immediate value `0x1234`, and store result into register `0x01`
- `cmp 0x01 0x02 0x??`: compare register `0x01` with register `0x02`, and store the result into register `0x01`
- `je 0x01 0x02 0x??`: jump execution to instruction pointed to by register `0x02`, if register `0x01` contains "equals"
- `jne 0x01 0x02 0x??`: jump execution to instruction pointed to by register `0x02`, if register `0x01` does not contain "equals"
- `jg 0x01 0x02 0x??`: jump execution to instruction pointed to by register `0x02`, if register `0x01` contains "greater than"
- `jng 0x01 0x02 0x??`: jump execution to instruction pointed to by register `0x02`, if register `0x01` does not contain "greater than"
- `jl 0x01 0x02 0x??`: jump execution to instruction pointed to by register `0x02`, if register `0x01` contains "less than"
- `jnl 0x01 0x02 0x??`: jump execution to instruction pointed to by register `0x02`, if register `0x01` does not contain "less than"

Comparison results are the following: `0x0000` means "equals", `0x0001` means "less than", `0x0002` means "greater than".

The execution context is a single program binary that is interpreted by the virtual machine. The program binary contains just a sequence of instructions.

Communication with the underlying virtual machine can be done by writing special data to special memory addresses. This is down to the VM implementation, so it's context-specific.

Device types:

- `0x00`: memory
- `0x01`: rom
- `0x02`: input
- `0x03`: output
- `0x04`: storage

## Architecture

The computer simulator is composed of a virtual machine executable that can run Sinann instructions.

At the boot the first code that is executed needs to be located at a known place, which would be a ROM containing a bootstrap program. In a more complex scenario, this bootstrap program would then jump to the operating system program located elsewhere.

Thus, at boot the contents of the boot ROM are loaded in memory at a fixed address, where the processor always starts its execution.

Since the processor always fetches another instruction, the virtual machine is designed to be always running, unless explicitly shut down by a special instruction.

The virtual machine itself can be seen as a device, providing an interface any program can talk to. In particular, the virtual machine can be instructed to shut down.
