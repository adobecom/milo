#!/bin/bash

urlPattern="https://www.adobe.com/special/tacocat/literals/{lang}.js"
languages=(
  'ar'
  'bg'
  'cs'
  'da'
  'de'
  'en'
  'es'
  'et'
  'fi'
  'fr'
  'he'
  'hu'
  'it'
  'ja'
  'ko'
  'lt'
  'lv'
  'nb'
  'nl'
  'pl'
  'pt'
  'ro'
  'ru'
  'sk'
  'sl'
  'sv'
  'tr'
  'uk'
  'zh_CN'
  'zh_TW'
)

scriptDir=$(dirname "$0")
outputFolder="$scriptDir/../literals/price"

# Create the output folder if it doesn't exist
mkdir -p "$outputFolder"

for lang in "${languages[@]}"
do
  url="${urlPattern/\{lang\}/$lang}"
  outputFile="${outputFolder}/${lang}.json"

  # Download the JavaScript file silently
  echo
  echo "Downloading $url"
  curl -s -o temp.js "$url"

  # Extract the JavaScript object
  extracted=$(sed -n -e "/window\.tacocat\.literals\['$lang'\] = {/,/};/ p" temp.js)

  # Remove the prefix and trailing semicolon
  extracted="${extracted#*= }"
  extracted="${extracted%;}"

  # Convert the JavaScript object to JSON
  jsonOutput=$(node -pe "JSON.stringify(eval($extracted), null, 2)")

  # Save the extracted JSON object as a JSON file
  echo "$jsonOutput" > "$outputFile"

  # Clean up temporary file
  rm temp.js

  # Get the current working directory
  currentDir=$(pwd)

  # Output the extracted JSON to console
  echo "Downloaded to $outputFile:"
  echo $jsonOutput
done
