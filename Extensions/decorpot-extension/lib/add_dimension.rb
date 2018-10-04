require 'sketchup.rb'
require 'rubygems'
require 'prawn'

module DecorpotExtension
	def self.download_pdf_dimensions
		@model = Sketchup.active_model
		@selection = @model.selection
		@count = @selection.length
		
		if @count != 0
			dialog = UI::WebDialog.new("#{DECORPOT_TITLE} - Dimensions", true, "#{DECORPOT_TITLE}-Dimensions", 700, 600, 150, 150, true)
			dialog.add_action_callback("get_dimension") {|d, val|
				val = val.to_i
				if val == 1
					@view = "Top"
					self.width_dimension(val)
					self.length_dimension(val)
					Sketchup.send_action('viewTop:')
					write_image(val)
					#Sketchup.undo
				elsif val == 2
					@view = "Bottom"
				elsif val == 3
					@view = "Left"
				elsif val == 4
					@view = "Right"
					self.width_dimension(val)
					self.height_dimension(val)
					self.length_dimension(val)
					Sketchup.send_action('viewRight:')
					#Sketchup.undo
					write_image(val)
				elsif val == 5
					@view = "Front"
					self.width_dimension(val)
					self.height_dimension(val)
					Sketchup.send_action('viewFront:')
					write_image(val)
					#Sketchup.undo
				elsif val == 6
					@view = "ISO"
				end
			}
			dialog.add_action_callback("cancel_settings") { |d, args| d.close }

			html_path = File.join(WEBDIALOG_PATH, 'dimension.html')
			dialog.set_file(html_path)
			if WIKIHOUSE_MAC
				dialog.show_modal
			else
				dialog.show
			end
		else
			UI.messagebox "No models are selected!", MB_OK
		end
	end

	def self.length_dimension(val)
		@selection = @model.selection
		@arr_length = []
		@selection.each {|sel|
			origin = sel.transformation.origin
			x = origin[0]
			y = origin[1]
			z = origin[2]
			if sel.class == Sketchup::Group
				box = sel.local_bounds
			elsif sel.class == Sketchup::ComponentInstance
				box = sel.definition.bounds
			end
			min_lengthx = box.min.x.to_f
			min_lengthy = box.min.y.to_f
			min_lengthz = box.min.z.to_f

			max_lengthx = box.max.x.to_f
			max_lengthy = box.max.y.to_f
			max_lengthz = box.max.z.to_f

			if !sel.definition.name.include?("HANDLE")
				if !@arr_length.include?(max_lengthy)
					@arr_length.push(max_lengthy)
					if val == 1
						dim_length = sel.entities.add_dimension_linear([min_lengthx, (min_lengthy + 5), max_lengthz], [max_lengthx, max_lengthy, max_lengthz], [-5, 0, 0])
					elsif val == 4
						if max_lengthz.to_i == 0
							dim_length = sel.entities.add_dimension_linear([max_lengthx, (min_lengthy + 5), min_lengthz], [max_lengthx, max_lengthy, min_lengthz], [0, 0, -5])
						else
							dim_length = sel.entities.add_dimension_linear([max_lengthx, (min_lengthy + 5), @max_lenz], [max_lengthx, max_lengthy, @max_lenz], [0, 0, 5])
						end
					end
					dim_length.material = 'blue'
				end
			end
			#return @len_points
		}
	end

	def self.width_dimension(val)
		@selection = @model.selection
		@arr_width = []
		@selection.each {|sel|
			origin = sel.transformation.origin
			x = origin[0]
			y = origin[1]
			z = origin[2]

			if sel.class == Sketchup::Group
				box = sel.local_bounds
			else
				box = sel.definition.bounds
			end
			min_widthx = box.min.x.to_f
			min_widthy = 0.to_f
			min_widthz = 0.to_f

			max_widthx = box.max.x.to_f
			max_widthy = 0.to_f
			max_widthz = box.max.z.to_f

			@max_lenx = max_widthx
			if !sel.definition.name.include?("HANDLE")
				if !@arr_width.include?(max_widthx)
					@arr_width.push(max_widthx)
					if val == 4
						@max_lenx = max_widthx
					elsif val == 5
						dim_width = sel.entities.add_dimension_linear([min_widthx, min_widthy, max_widthz], [max_widthx, max_widthy, max_widthz], [0, 0, 5])
						dim_width.material = 'blue'
					elsif val == 1
						dim_width = sel.entities.add_dimension_linear([min_widthx, min_widthy, max_widthz], [max_widthx, max_widthy, max_widthz], [0, -5, 0])
						dim_width.material = 'blue'
					end
					
				end
			end
			#return @wid_points
		}
	end

	def self.height_dimension(val)
		@selection = @model.selection
		@arr_height = []
		@selection.each {|sel|
			origin = sel.transformation.origin
			x = origin[0]
			y = origin[1]
			z = origin[2]

			if sel.class == Sketchup::Group
				box = sel.local_bounds
			elsif sel.class == Sketchup::ComponentInstance
				box = sel.definition.bounds
			end
			min_heightx = box.min.x.to_f
			min_heighty = 0.to_f
			min_heightz = box.min.z.to_f

			max_heightx = box.min.x.to_f
			max_heighty = box.min.y.to_f
			max_heightz = box.max.z.to_f

			@max_lenz = max_heightz
			if !sel.definition.name.include?("HANDLE")
				if !@arr_height.include?(max_heightz)
					@arr_height.push(max_heightz)
					if val == 5
						dim_height = sel.entities.add_dimension_linear([min_heightx, max_heighty, min_heightz], [max_heightx, max_heighty, (max_heightz - 5)], [-5, 0, 0])
					elsif val == 4
						dim_height = sel.entities.add_dimension_linear([@max_lenx, max_heighty, min_heightz], [@max_lenx, max_heighty, max_heightz], [0, -5, 0])
					else
						dim_height = sel.entities.add_dimension_linear([min_heightx, max_heighty, min_heightz], [max_heightx, max_heighty, max_heightz], [0, 5, 0])
					end
					dim_height.material = 'blue'
				end
			end
		}
	end

	def write_image(val)
		view = Sketchup.active_model.active_view
		if val == 1
			@name = "Top View"
			eye = [0, 0, 500]
			target = [0, 0, 0]
			up = [-0.006059714697060147, 0.9701603229993295, -0.2423885878824059]
		elsif val == 4
			@name = "Right View"
			eye = [500, 0, 50]
			target = [0, 0, 0]
			up = [-1, 0, 0]
		elsif val == 5
			@name = "Front View"
			eye = [0, -450, 70]
			target = [0, 0, 0]
			up = [0, 0, 1]
		end
		cam = Sketchup::Camera.new eye, target, up
		view.camera = cam
		keys = {
		  :filename => "C:/Users/Admin/Desktop/Images/#{@name}.png",
		  :width => view.vpwidth,
		  :height => view.vpheight,
		  :antialias => false,
		  #:compression => 0.9,
		  :transparent => true
		}
		view.write_image keys

		#options_hash = { :show_summary => true,
    #             :output_profile_lines => false,
     #            :map_fonts => false,
      #           :model_units => Length::Meter }
		#status = @model.export("C:/Users/Admin/Desktop/Images/#{@name}.pdf", options_hash)
		
=begin
		html = %Q[
			<html>
			<head>
			<style>
			img {
			  height:10cm;
			  width:10cm;
			}
			</style>
			</head><body><div class="container">
			        <img src="#{keys[:filename]}" alt="#{File.basename(keys[:filename], '.png')}"></div>
			</body></html>
			]
		dlg = UI::WebDialog.new("#{keys[:filename]}", false, '', 400, 400, 100, 100, false)
		dlg.set_html(html)
		dlg.show
		Sketchup.undo
=end
#Sketchup.undo
	end
end