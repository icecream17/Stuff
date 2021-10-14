# Language
# A programming language for defining programming languages

if __name__ == '__main__':
  main()

ask = input

def main():
  command = ask('Options: help, run, import').strip()
  if command == 'help':
    Help()
  elif command == 'run':
    Run()
  elif command == 'import':
    Import()

def Help():
  raise NotImplementedError('Oof')

def Run():
  raise NotImplementedError()

def Import():
  raise NotImplementedError()
