from pathlib import Path
from PyPDF2 import PdfReader
for file in [Path('semilleroinfo/informacionSemillero.pdf'), Path('semilleroinfo/proyectosSemillero.pdf')]:
    print('-----', file, '-----')
    reader = PdfReader(str(file))
    for i, page in enumerate(reader.pages[:3], start=1):
        text = page.extract_text()
        print(f'-- PAGE {i} --')
        print(text[:2500])
        print()
