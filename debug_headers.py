from docx.document import Document
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import _Cell, Table
from docx.text.paragraph import Paragraph
import docx
import re

def iter_block_items(parent):
    if isinstance(parent,  docx.document.Document):
        parent_elm = parent.element.body
    elif isinstance(parent, _Cell):
        parent_elm = parent._tc
    else:
        raise ValueError("something's not right")

    for child in parent_elm.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)

def debug_headers(file_path):
    doc = docx.Document(file_path)
    
    # Regex muy laxo para ver qué hay
    re_broad = re.compile(r'(Test|Tema)', re.IGNORECASE)
    
    print("--- Buscando posibles cabeceras ---")
    for block in iter_block_items(doc):
        text_blocks = []
        if isinstance(block, Paragraph):
            if block.text.strip(): text_blocks.append(block.text.strip())
        elif isinstance(block, Table):
            for row in block.rows:
                for cell in row.cells:
                    for para in cell.paragraphs:
                        if para.text.strip(): text_blocks.append(para.text.strip())
        
        for text in text_blocks:
            if len(text) < 100 and re_broad.search(text):
                print(f"[{len(text)}] {text}")

if __name__ == "__main__":
    debug_headers('pinche test mad CM.docx')
