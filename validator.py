from lxml import etree

def validate_xml(xml_file, xsd_file):
    try:
        # Parse the XSD schema
        with open(xsd_file, 'r') as schema_file:
            schema_root = etree.XML(schema_file.read())
            schema = etree.XMLSchema(schema_root)

        # Parse the XML file
        with open(xml_file, 'r') as xml_file:
            xml_doc = etree.parse(xml_file)

        # Validate the XML file against the XSD schema
        schema.assertValid(xml_doc)
        print(f"{xml_file.name} is valid against {xsd_file}")

    except etree.XMLSchemaParseError as e:
        print(f"XMLSchemaParseError: {e}")
    except etree.DocumentInvalid as e:
        print(f"DocumentInvalid: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Validate XML against XSD")
    parser.add_argument("xml_file", help="Path to the XML file")
    parser.add_argument("xsd_file", help="Path to the XSD file")

    args = parser.parse_args()

    validate_xml(args.xml_file, args.xsd_file)