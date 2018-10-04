module DecorpotExtension
	def self.decorpot_config
		#dialog = UI::WebDialog.new("#{DECORPOT_TITLE} - Configuration", true, "#{DECORPOT_TITLE}-Configuration", 900, 700, 150, 150, true)
		#dialog.set_url("http://192.168.0.132:3000/")
		#dialog.show

		dialog = UI::WebDialog.new("#{DECORPOT_TITLE} - Configuration", true, "#{DECORPOT_TITLE}-Configuration", 700, 600, 150, 150, true)
		dialog.add_action_callback("get_category") {|d, val|
			val = val.to_s
			#load_category(val)
			@path = DECORPOT_ASSETS + "/" + val + "/"
			@arr_value = []
			@dirpath = Dir[@path+"*"]
			
			@dirpath.each {|file|
				@arr_value.push(file)
			}
			js_subcat = "passSubCategoryToJs("+@arr_value.to_s+")"
			d.execute_script(js_subcat)
		}

		dialog.add_action_callback("load-sketchupfile") {|s, cat|
			cat = cat.split(",")
			@subpath = DECORPOT_ASSETS + "/" + cat[0] + "/" + cat[1] + "/"
			@subarr = []
			@subdir = Dir[@subpath+"*.skp"]
			@subdir.each{|s|
				@subarr.push(s)
			}
			js_command = "passFromRubyToJavascript("+ @subarr.to_s + ")"
			s.execute_script(js_command)
		}

		dialog.add_action_callback("place_model"){|d, val|
			place_component(val)
		}

		html_path = File.join(WEBDIALOG_PATH, 'decor_config.html')
		dialog.set_file(html_path)
		dialog.show
	end

	def place_component(val)
		@model = Sketchup::active_model
		cdef = @model.definitions.load(val)
		point = Geom::Point3d::new( 0, 0, 0 )
		cinst = @model.active_entities.add_instance(cdef, Geom::Transformation::new( point ))
	end

	def load_category(val)
		@model = Sketchup::active_model
		if val == 1
			@name = "base cabinets"
			@dirpath = Dir["C:/Users/Admin/Desktop/backup-files/base cabinets/*.DWG"]
		elsif val == 2
			@name = "wardrobes"
			@dirpath = Dir["C:/Users/Admin/Desktop/backup-files/wardrobes/*.skp"]
		elsif val == 3
			@name = ""
		elsif val == 4
			@name = ""
		end
		@dirpath.each {|file|
			split_val = file.split("/")
			model_name = split_val.last.split(".").first
			basic_cmd = UI::Command.new(@name) {
				cdef = @model.definitions.load(file)
				point = Geom::Point3d::new( 0, 0, 0 )
				cinst = @model.active_entities.add_instance(cdef, Geom::Transformation::new( point ))
			}
			basic_cmd.tooltip = "#{model_name}"
			basic_toolbar = UI::Toolbar.new "#{@name}"
			basic_toolbar.add_item basic_cmd
			basic_toolbar.show
		}
	end
end