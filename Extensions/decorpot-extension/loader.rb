module DecorpotExtension
  SUPPORT_PATH = File.join(File.dirname(__FILE__))
  LIB_PATH = File.join(SUPPORT_PATH, 'lib')
  WEBDIALOG_PATH = File.join(SUPPORT_PATH, 'webdialog')
  DECORPOT_ASSETS = File.join(SUPPORT_PATH, 'decorpot-assets')

  path = File.dirname(__FILE__)
  lib_path = File.join(path, 'lib')

  Sketchup::require File.join(lib_path, 'utils.rb')
  Sketchup::require File.join(lib_path, 'core.rb')
  Sketchup::require File.join(lib_path, 'decorpot_configuration.rb')
end
