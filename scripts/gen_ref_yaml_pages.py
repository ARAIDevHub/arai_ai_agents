import shutil
from pathlib import Path

def create_markdown_for_yaml(yaml_path, output_file):
    """
    Generate markdown content for a given YAML file.
    """
    # Copy the YAML file to the docs/yaml directory
    target_yaml_dir = root_dir / "docs" / "yaml"
    target_yaml_dir.mkdir(parents=True, exist_ok=True)
    target_yaml_path = target_yaml_dir / yaml_path.name
    shutil.copy(yaml_path, target_yaml_path)

    # Path relative to the docs directory
    relative_path = target_yaml_path.relative_to(root_dir / "docs").as_posix()

    with open(output_file, "w") as md_file:
        md_file.write(f"# {yaml_path.stem.replace('_', ' ').title()}\n\n")
        md_file.write(f"```yaml linenums='1'\n")
        md_file.write(f"{{% include \"{relative_path}\" %}}\n")
        md_file.write(f"```\n")
    print(f"Generated markdown: {output_file} and copied YAML to {target_yaml_path}")

def process_yaml_files():
    """
    Automatically find YAML files and create markdown documentation.
    """
    yaml_source = root_dir / "ava_ai_agents"  # YAML source folder
    output_dir = root_dir / "docs" / "yaml"

    print(f"Looking for YAML files in: {yaml_source}")
    output_dir.mkdir(parents=True, exist_ok=True)

    for yaml_file in yaml_source.rglob("*.yaml"):
        # Skip the 'configs' directory and its subfolders
        if "configs" in yaml_file.parts:
            print(f"Skipping file in configs folder: {yaml_file}")
            continue

        print(f"Found YAML file: {yaml_file}")

        # Create output path based on the YAML file's relative structure
        relative_path = yaml_file.relative_to(yaml_source)
        output_path = output_dir / relative_path.with_suffix(".md")
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Generate markdown for the YAML file
        create_markdown_for_yaml(yaml_file, output_path)


if __name__ == "__main__":
    root_dir = Path(__file__).parent.parent  # Define the root of the project
    process_yaml_files()
