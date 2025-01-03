"""Generate the code reference pages and navigation."""
from pathlib import Path
import mkdocs_gen_files

nav = mkdocs_gen_files.Nav()

root = Path(__file__).parent.parent
src = root / "ava_ai_agents"

print(f"Looking for Python files in: {src}")

# First, process __init__.py files to create module indexes
for path in sorted(src.rglob("__init__.py")):
    module_path = path.relative_to(src).parent
    doc_path = path.relative_to(src).parent / "index.md"
    full_doc_path = Path("api", doc_path)

    parts = tuple(module_path.parts)
    
    if parts:
        # Create the module index page
        with mkdocs_gen_files.open(full_doc_path, "w") as fd:
            ident = "ava_ai_agents"
            if parts:
                ident += "." + ".".join(parts)
            print(f"Writing module index: {ident}")
            fd.write(f"# {parts[-1] if parts else 'ava_ai_agents'}\n\n")
            fd.write(f"::: {ident}")

        mkdocs_gen_files.set_edit_path(full_doc_path, path.relative_to(root))

# Then process other Python files
for path in sorted(src.rglob("*.py")):
    module_path = path.relative_to(src).with_suffix("")
    doc_path = path.relative_to(src).with_suffix(".md")
    full_doc_path = Path("api", doc_path)

    parts = tuple(module_path.parts)

    if parts[-1] == "__init__":
        continue  # Skip __init__.py files as they're already processed
    elif parts[-1] == "__main__":
        continue
    elif "_pycache_" in str(path):
        continue

    # Use nested navigation to ensure collapsible sections
    if len(parts) > 1:
        nav[parts[:-1] + (parts[-1],)] = doc_path.as_posix()
    else:
        nav[parts] = doc_path.as_posix()

    print(f"Added to nav: {parts} -> {doc_path.as_posix()}")

    with mkdocs_gen_files.open(full_doc_path, "w") as fd:
        ident = "ava_ai_agents." + ".".join(parts)
        print(f"Writing docs for: {ident}")
        fd.write(f"# {parts[-1]}\n\n")  # Add a title
        fd.write(f"::: {ident}")

    mkdocs_gen_files.set_edit_path(full_doc_path, path.relative_to(root))

# Write the navigation file
summary_file = Path("api/SUMMARY.md")
with mkdocs_gen_files.open(summary_file, "w") as nav_file:
    for line in nav.build_literate_nav():
        # Convert *-based bullet points to `-` for MkDocs
        nav_file.write(line.replace("*", "-"))
