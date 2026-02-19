import re

def truncate_file():
    input_file = 'manual_input.txt'
    
    try:
        with open(input_file, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        try:
             with open(input_file, 'r', encoding='latin-1') as f:
                content = f.read()
        except:
            print("Failed to read file.")
            return

    # Find end of question 100
    # Pattern: "100. ... Solución: b"
    # We look for "100." and then the next "Solución:"
    
    match = re.search(r'100\..*?Solución:\s*[a-d]\s*', content, re.DOTALL | re.IGNORECASE)
    
    if match:
        end_pos = match.end()
        new_content = content[:end_pos]
        
        with open(input_file, 'w', encoding='utf-8') as f:
            f.write(new_content + "\n\n")
        print(f"Truncated file at position {end_pos}. Ready for appending.")
    else:
        print("Could not find Question 100. File might be incomplete or different format.")
        # If we can't find 100, maybe it's already short? Or maybe we should just write the header.
        # Check if file has header "Test n.º 11"
        if "Test n.º 11" in content:
            print("Header found but not Q100. Leaving as is (dangerous).")
        else:
            print("Header NOT found. Writing header.")
            with open(input_file, 'w', encoding='utf-8') as f:
                f.write("Test n.º 11: Los alimentos y nutrición (Parte 1: 1-100)\n\n")

if __name__ == "__main__":
    truncate_file()
