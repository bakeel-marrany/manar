import urllib.request,re,pathlib
url='https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap'
req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
css=urllib.request.urlopen(req).read().decode()
print(css)
