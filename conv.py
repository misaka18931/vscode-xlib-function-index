#!/usr/bin/env python
from bs4 import BeautifulSoup as bs
from typing import NamedTuple
import os
xlibdir = './xlib'

def bsparse(*args):
  global xlibdir
  fd = open(os.path.join(xlibdir, *args))
  htmlstr = fd.read()
  return bs(htmlstr, 'html.parser')

class func:
  name: str = ''
  path: str = ''
  content: bs = bs()

o = {}

for p in bsparse('function-index.html').table.find_all('a'):
  _name = p.get_text();
  o[_name] = func()
  o[_name].name = p.get_text()
  o[_name].path = p.get('href')

for p in o.values():
  try:
    if '#' in p.path:
      for u in bsparse(p.path.split('#')[0]).body.find_all('h2'):
        pass
    else:
      p.content = bsparse(p.path).body
  except:
    pass


for p in o.values():
  print('["{}", "{}"],'.format(p.name, p.path))
  pass



