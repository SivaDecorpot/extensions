module DecorpotExtension
	def  self.height_config
		dialog = UI::WebDialog.new("#{DECORPOT_TITLE} - Height Configuration", true, "#{DECORPOT_TITLE}-Height Configuration", 400, 700, 150, 150, true)
		
		html_path = File.join(WEBDIALOG_PATH, 'height_config.html')
		dialog.set_file(html_path)
		dialog.show

		dialog.add_action_callback("height_value") {|d, val|
			model = Sketchup.active_model
			ent = model.entities
			min = 0
			max = ent.length
			@c = []
			while min <= max
				count = Sketchup.active_model.entities[min]
				if count.class != NilClass
					countdef = count.definition
					if countdef.name.include?("tandam")
						@c.push(min)
					end
				end
				min += 1
			end
			 comp_instace = all_attributechange(val, @c.length)
			 $dc_observers.get_latest_class.redraw_with_undo(comp_instace)
			#json_from = JSON.parse(open("C:/Users/Admin/Desktop/data_json.json").read)
			#json_from.each {|js|
				#project = DecorpotExtension::StackFromJson.new(js, val)
				
			#}
		}
	end

	def all_attributechange(val, cot)
		model = Sketchup.active_model
		ent = model.entities
		min = 0
		max = ent.length
		
		while min <= max
			@sang = Sketchup.active_model.entities[min]
			if @sang.class != NilClass
				sang_def = @sang.definition
				arr_val = {}
				if sang_def.name == "side_ply"
					k = "_lenz_formula"
					v = val
					arr_val[k] = v
				elsif sang_def.name == "back_side_ply"
					k = "_lenz_formula"
					v = val.to_i - 2
					arr_val[k] = v.to_s
					k1 = "_z_formula"
					v1 = val.to_i - 3
					arr_val[k1] = v1.to_s
				elsif sang_def.name == "top_ply"
					k = "_z_formula"
					v = val
					arr_val[k] = v
				elsif sang_def.name == "tandam_bottom"
					k = "_lenz_formula"
					v = val.to_i / cot
					arr_val[k] = v.to_s
				elsif sang_def.name == "tandam_top"
					k = "_lenz_formula"
					v = val.to_i / cot
					arr_val[k] = v.to_s
					chval = stackfromjson(val)
					k1 = "_z_formula"
					v1 = (val.to_i / cot) + chval
					arr_val[k1] = v1.to_s
				end
				arr_val.each {|ky, vl|
					#puts "#{ky}-----#{vl.class}"
					sang_def.set_attribute 'dynamic_attributes', ky, vl
					@need_redraw = 1
				}
				#sang_def.set_attribute 'dynamic_attributes', k, v
				min += 1
			end
			$dc_observers.get_latest_class.redraw_with_undo(@sang)
		end
	end

	def single_change(val)
		sang = Sketchup.active_model.entities[0]
		sang_def = sang.definition
		puts sang_def.name, val
		k = "_lenz_formula"
		sang_def.set_attribute 'dynamic_attributes', k, val
		dcs = $dc_observers.get_latest_class
		dcs.redraw_with_undo(sang)
	end

	def set_manual(sang, k, v)
		sang_def = sang.definition
		sang_def.set_attribute 'dynamic_attributes', k, v
		$dc_observers.get_latest_class.redraw_with_undo(sang)
	end

	def stackfromjson(input)
		input = input.to_i
		if input <= 70
			val = 20
		elsif input <= 80
			val = 22.7
		elsif input <= 90
			val = 25.7
		elsif input <= 100
			val = 28.5
		elsif input <= 110
			val = 31.5
		elsif input <= 120
			val = 34.0
		elsif input <= 130
			val = 37.0
		elsif input <= 140
			val = 40.0
		elsif input <= 150
			val = 42.5
		elsif input <= 160
			val = 45.5
		elsif input <= 170
			val = 48.5
		elsif input <= 180
			val = 51.5
		elsif input <= 190
			val = 54.0
		elsif input <= 200
			val = 57.0
		elsif input <= 210
			val = 60.0
		elsif input <= 220
			val = 63.0
		elsif input <= 230
			val = 65.5
		elsif input <= 240
			val = 68.5
		elsif input <= 250
			val = 71.5
		elsif input <= 260
			val = 74.0
		elsif input <= 270
			val = 77.0
		elsif input <= 280
			val = 79.5
		elsif input <= 290
			val = 83.0
		elsif input <= 300
			val = 85.5
		elsif input <= 310
			val = 88.5
		elsif input <= 320
			val = 91.0
		elsif input <= 330
			val = 94.0
		elsif input <= 340
			val = 97.0
		elsif input <= 350
			val = 100.0
		elsif input <= 360
			val = 102.0
		elsif input <= 370
			val = 105.0
		elsif input <= 380
			val = 108.0
		elsif input <= 390
			val = 111.0
		elsif input <= 400
			val = 114.0
		end
		return val
	end
end