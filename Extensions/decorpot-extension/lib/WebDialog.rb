module DecorpotExtension
  def self.load_decorpot_settings
    dialog = UI::WebDialog.new("#{DECORPOT_TITLE} - Settings", true, "#{DECORPOT_TITLE}-Settings", 700, 600, 150, 150, true)

    dialog.add_action_callback('create_face') { |d, arg|
      if arg.to_s.length == 0
        puts "Invalid input. Coordinates must be valid number."
      else
        v = arg.to_s.split(",")
        pt1 = Geom::Point3d.new(Float(v[0].strip), Float(v[1].strip), Float(v[2].strip))
        pt2 = Geom::Point3d.new(Float(v[3].strip), Float(v[4].strip), Float(v[5].strip))
        pt3 = Geom::Point3d.new(Float(v[6].strip), Float(v[7].strip), Float(v[8].strip))
        pt4 = Geom::Point3d.new(Float(v[9].strip), Float(v[10].strip), Float(v[11].strip))

        vec1 = pt2 - pt1
        vec2 = pt2 - pt3
        plane = [pt1, vec1 * vec2]
        if pt4.on_plane? plane
          Sketchup.active_model.entities.add_face pt1, pt2, pt3, pt4
        else
          puts "Invalid input. Points must lie on the same plane"
        end
      end

    }

    dialog.add_action_callback("cancel_settings") { |d, args|
      d.close }
    
    html_path = File.join(WEBDIALOG_PATH, 'settings.html')
    dialog.set_file(html_path)
    if WIKIHOUSE_MAC
      dialog.show_modal
    else
      dialog.show
    end
  end

  def self.load_decorpot_shapes
    dialog = UI::WebDialog.new("#{DECORPOT_TITLE} - Shapes", true, "#{DECORPOT_TITLE} - Shapes", 700, 800, 150, 150, true)

    dialog.add_action_callback('create_square') { |d, arg|
      v = arg.split(",")
      points = [
        Geom::Point3d.new(0, 0, 0),
        Geom::Point3d.new(Float(v[0]), 0, 0),
        Geom::Point3d.new(Float(v[0]), Float(v[0]), 0),
        Geom::Point3d.new(0, Float(v[0]), 0)
      ]
      model = Sketchup.active_model
      group = model.active_entities.add_group
      entities = group.entities
      face = entities.add_face(points)
    }

    dialog.add_action_callback('create_rectangle') { |d, arg|
      v = arg.split(",")
      points = [
        Geom::Point3d.new(0, 0, 0),
        Geom::Point3d.new(Float(v[0]), 0, 0),
        Geom::Point3d.new(Float(v[0]), Float(v[1]), 0),
        Geom::Point3d.new(0, Float(v[1]), 0)
      ]
      ents = Sketchup.active_model.entities
      addface = ents.add_face points
    }

    dialog.add_action_callback('create_circle') { |d, arg|
      v = arg.split(",")
      ents = Sketchup.active_model.entities
      face = ents.add_circle [0, 0, 0], [0, 0, 1], Float(v[0])
      addface = ents.add_face face
    }

    dialog.add_action_callback('create_cube') { |d, arg|
      if arg.to_s.length == 0
        puts "Invalid input. Coordinates must be valid number."
      else
        v = arg.to_s.split(",")
        points = [
          Geom::Point3d.new(0, 0, 0),
          Geom::Point3d.new(Float(v[0]), 0, 0),
          Geom::Point3d.new(Float(v[0]), Float(v[0]), 0),
          Geom::Point3d.new(0, Float(v[0]), 0)
        ]

        model = Sketchup.active_model
        group = model.active_entities.add_group
        entities = group.entities
        face = entities.add_face(points)
        face.reverse!
        face.pushpull(1)

      end
    }


    dialog.add_action_callback('create_cylinder') { |d, arg|
      v = arg.split(",")
      model = Sketchup.active_model
      entities = model.active_entities
      centerpoint = Geom::Point3d.new
      vector = Geom::Vector3d.new(0,0,Float(v[0]))
      edgearray = entities.add_circle centerpoint, vector, Float(v[1])
      face = entities.add_face(edgearray)
      face.pushpull(-1.m)
    }

    dialog.add_action_callback('create_cone') { |d, arg|
      v = arg
      puts "-------------cone----",v
    }

    dialog.add_action_callback('create_pyramid') { |d, arg|
      v = arg
      puts "-------------pyramid----",v
    }

    dialog.add_action_callback("cancel_settings") { |d, args| d.close }

    html_path = File.join(WEBDIALOG_PATH, 'shapes.html')
    dialog.set_file(html_path)
    if WIKIHOUSE_MAC
      dialog.show_modal
    else
      dialog.show
    end
  end
end