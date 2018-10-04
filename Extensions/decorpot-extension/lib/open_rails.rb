module DecorpotExtension
	def self.open_app
		dialog = UI::WebDialog.new("#{DECORPOT_TITLE} - Server", true, "#{DECORPOT_TITLE}-Server", 900, 700, 150, 150, true)
		dialog.set_url("http://192.168.0.107:3000/")
		dialog.show
	end
end