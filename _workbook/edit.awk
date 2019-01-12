/^ref:/ {
  gsub(/Part 1: Lesson /,"")
  gsub(/Part II: Lesson /,"")
  print
  next
}
/^<a class/ {
  gsub(/acim\//,"")
  print
  next
}
/\/acim\/workbook/ {
  gsub(/\(\/acim/,"(")
  print
  next
}
{
  print
}

