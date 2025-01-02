import os
from pathlib import Path

# Define the main project directory and output documentation directory
main_project_dir = Path("ava_ai_agents")  # Replace with your main module's path
output_dir = Path("docs/yaml_docs")

# Ensure the output directory exists
output_dir.mkdir(parents=True, exist_ok=True)

def create_markdown_for_yaml(yaml_path, output_file):
    """Generate markdown content for a given YAML file."""
    yaml_relative_path = yaml_path.relative_to(main_project_dir.parent)
    with open(output_file, "w") as md_file:
        md_file.write(f"# {yaml_path.stem.replace('_', ' ').title()}\n\n")
        md_file.write(f"```yaml\n")
        md_file.write(f"{{% include \"../../{yaml_relative_path}\" %}}\n")
        md_file.write(f"```\n")
    print(f"Generated markdown: {output_file}")

def process_yaml_files():
    """Automatically find YAML files and create markdown documentation."""
    for yaml_file in main_project_dir.rglob("*.yaml"):
        # Create a corresponding folder structure in the output directory
        relative_path = yaml_file.relative_to(main_project_dir)
        output_path = output_dir / relative_path.with_suffix(".md")
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Generate the markdown file
        create_markdown_for_yaml(yaml_file, output_path)

# Run the YAML processing
if __name__ == "__main__":
    process_yaml_files()
