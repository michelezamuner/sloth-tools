use crate::Seg;

#[derive(Debug, PartialEq)]
pub enum Error {
  CannotWriteToDevice,
  InvalidSegment(Seg),
  MissingDevice,
}
