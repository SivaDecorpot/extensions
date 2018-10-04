module DecorpotExtension
	def self.bounding_box
		model = Sketchup.active_model
		ents = model.active_entities
		selection = model.selection
		if selection.length != 0
			selection.each do |sel|
				bb = sel.bounds
				UI.messagebox "Height - #{bb.depth}, Length - #{bb.height}, Width - #{bb.width}"
				puts "mini",bb.min.x, bb.min.y, bb.min.z
				puts "max",bb.max.x, bb.max.y, bb.max.z
			end
		else
			UI.messagebox "No models are selected!", MB_OK
		end
	end

	def self.comp_attribute
		dCDicoName = "dynamic_attributes"
		model = Sketchup.active_model
		selection = Sketchup.active_model.selection
		selection.each{ |ent|
			dict = ent.attribute_dictionary('dynamic_attributes')
			dict.each { | key, val |
				puts "#{key}:#{val}"
			}
		}
		#enties = model.entities
		#enties.each {|ent|
		#	if ent.class == Sketchup::ComponentInstance
		#		model_def = model.definitions	
		#		model_def.attribute_dictionary dCDicoName, true
		#		model_def.set_attribute 'dynamic_attributes', 'material', 'red'
		#		$dc_observers.get_latest_class.redraw_with_undo(model_def)
		#	end
		#}
		#model_def = model.definitions

		#model_def.set_attribute 'dynamic_attributes', 'material', 'red'
		#model_def.set_attribute 'dynamic_attributes', '_material_formula', '"red"'
		#$dc_observers.get_latest_class.redraw_with_undo(model_def)
		#entities = model.entities.set_attribute 'dynamic_attributes', 'material', 'red'
		#for entity in entities
		#	attribute = entity.definition.set_attribute 'dynamic_attributes', 'material', 'red'
		#	puts "--------asa",attribute.inspect
		#end
	end
end