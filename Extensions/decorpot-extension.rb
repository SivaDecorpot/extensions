require 'sketchup.rb'
require 'extensions.rb'

module DecorpotExtension
  path = File.dirname(__FILE__)
  loader = File.join(path, 'decorpot-extension', 'loader.rb')
  
  title = 'Decorpot Plugin Development Version'
  EXTENSION = SketchupExtension.new(title, loader)
  EXTENSION.version     = '0.3.4'
  EXTENSION.copyright   = 'Public Domain - 2018'
  EXTENSION.creator     = 'Decorpot Development Team'
  
  Sketchup.register_extension(EXTENSION, true)
end
