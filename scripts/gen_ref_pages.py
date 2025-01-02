"""Generate the code reference pages and navigation."""

from pathlib import Path
import mkdocs_gen_files

nav = mkdocs_gen_files.Nav()

root = Path(__file__).parent.parent
src = root / "ava_ai_agents"

print(f"Looking for Python files in: {src}")

for path in sorted(src.rglob("*.py")):
    module_path = path.relative_to(src).with_suffix("")
    doc_path = path.relative_to(src).with_suffix(".md")
    full_doc_path = Path("reference", doc_path)

    parts = tuple(module_path.parts)
    
    print(f"Processing file: {path}")
    print(f"Parts: {parts}")

    # Skip __pycache__ directories
    if "_pycache_" in str(path):
        continue

    # Handle root level files
    if len(parts) == 1:
        if parts[0] == "__init__":
            continue
        elif parts[0] == "__main__":
            continue
        nav[parts] = doc_path.as_posix()
    # Handle nested modules
    else:
        if parts[-1] == "__init__":
            parts = parts[:-1]
        elif parts[-1] == "__main__":
            continue
        
        if parts:  # Only add if we have parts left
            nav[parts] = doc_path.as_posix()

    with mkdocs_gen_files.open(full_doc_path, "w") as fd:
        ident = "ava_ai_agents." + ".".join(parts)
        fd.write(f"::: {ident}")

    mkdocs_gen_files.set_edit_path(full_doc_path, path.relative_to(root))

with mkdocs_gen_files.open("reference/SUMMARY.md", "w") as nav_file:
    nav_file.writelines(nav.build_literate_nav())