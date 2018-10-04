module DecorpotExtension
  DECORPOT_TITLE = 'Decorpot'
  SKETCHUP_CONSOLE.show
  DECORPOT_CONFIGURATION = UI::Command.new('Configuration'){
    self.decorpot_config
  }
  DECORPOT_MENU = UI.menu('Plugins').add_submenu(DECORPOT_TITLE)
  DECORPOT_MENU.add_item(DECORPOT_CONFIGURATION)
end