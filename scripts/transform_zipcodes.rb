require 'csv'
require 'json'

zipcodes = Hash.new

CSV.foreach('../data/us_postal_codes.csv', headers: true) do |row|
  if row['zip']
    zipcodes[row['zip']] = [ row['lat'].to_f, row['lon'].to_f ]
  end
end

File.open('../data/us_postal_codes.js', 'w') do |f|
  f.puts 'window.KNOWN_ZIPCODES ='
  f.puts zipcodes.to_json
  f.puts ';'
end
