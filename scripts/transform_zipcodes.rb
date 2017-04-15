require 'csv'
require 'json'

zipcodes = Hash.new

CSV.foreach('../src/data/us_postal_codes.csv', headers: true) do |row|
  if row['zip']
    zipcodes[row['zip']] = [ row['lon'].to_f, row['lat'].to_f ]
  end
end

File.open('../src/data/us_postal_codes.json', 'w') do |f|
  f.puts zipcodes.to_json
end
