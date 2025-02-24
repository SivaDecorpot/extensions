module DecorpotExtension
  def self.save_model(model)
    if Sketchup.version.split('.').first < 14
      Sketchup.send_action('saveDocument:')
    else
      model.save
    end
  end
     
  def get_documents_directory(home, docs)
    dir = File.join home, docs
    if not (File.directory?(dir) and File.writable?(dir))
      home
    else
      dir
    end
  end

  def get_temp_directory
    temp = '.'
    for dir in [ENV['TMPDIR'], ENV['TMP'], ENV['TEMP'], ENV['USERPROFILE'], '/tmp']
    if dir and File.directory?(dir) and File.writable?(dir)
      temp = dir
      break
    end
    end
    File.expand_path temp
  end
  
  def self.gen_status_msg(msg)
    return [
      msg + " .",
      msg + " ..",
      msg + " ...",
      msg + " ....",
      msg + " .....",
    ]
  end
  
  WIKIHOUSE_DETECTION_STATUS = self.gen_status_msg "Detecting matching faces"
  WIKIHOUSE_DXF_STATUS = self.gen_status_msg "Generating DXF output"
  WIKIHOUSE_LAYOUT_STATUS = self.gen_status_msg "Nesting panels for layout"
  WIKIHOUSE_PANEL_STATUS = self.gen_status_msg "Generating panel data"
  WIKIHOUSE_SVG_STATUS = self.gen_status_msg "Generating SVG output"
      
  # Dummy Group
  class WikiHouseDummyGroup 
    attr_reader :name
  
    def initialize
      @name = "Ungrouped Objects"
    end
  end
  WIKIHOUSE_DUMMY_GROUP = WikiHouseDummyGroup.new
  
  def get_wikihouse_thumbnail(model, view, suffix)
    filename = File.join WIKIHOUSE_TEMP, "#{model.guid}-#{suffix}.png"
    opts = {
      :antialias => true,
      :compression => 0.8,
      :filename => filename,
      :height => [view.vpheight, 1600].min,
      :transparent => true,
      :width => [view.vpwidth, 1600].min
    }
    view.write_image opts
    data = File.open(filename, 'rb') do |io|
      io.read
    end
    File.delete filename
    data
  end
  
  def set_dom_value(dialog, id, value)
    if value.length > 2097152
      dialog.execute_script "WIKIHOUSE_DATA = [#{value[0...2097152].inspect}];"
      start, stop = 2097152, (2097152+2097152)
      idx = 1
      while 1
        segment = value[start...stop]
        if not segment
          break
        end
        dialog.execute_script "WIKIHOUSE_DATA[#{idx}] = #{segment.inspect};"
        idx += 1
        start = stop
        stop = stop + 2097152
      end
      dialog.execute_script "document.getElementById('#{id}').value = WIKIHOUSE_DATA.join('');"
    else
      dialog.execute_script "document.getElementById('#{id}').value = #{value.inspect};"
    end
  end
  
  def show_wikihouse_error(msg)
    UI.messagebox "!! ERROR !!\n\n#{msg}"
  end
  
  extend self
  # Adds all instance methods previously defined here in a 'WikiHouseExtension' namespace to  
  # the module itself, therfore allowing access to instance methods without the need to make a class first.

  # ------------------------------------------------------------------------------
  # Utility Classes
  # ------------------------------------------------------------------------------
 
  # App Observer
  # ------------------------------------------------------------------------------
  class DecorpotAppObserver < Sketchup::AppObserver
    
    def onNewModel(model)
    end
  
    # TODO(tav): This doesn't seem to be getting called.
    # (Chris) Should do now I think. Still need to test.
    #
    # (thomthom) Displaying modal windows, or any window, during the shutdown
    # sequence might cause problems. Avoid doing that. Until the purpose of the
    # message is known I leave them uncommented and output to console.
    def onQuit
      if DECORPOT_DOWNLOADS.length > 0
        #show_wikihouse_error "Aborting downloads from #{WIKIHOUSE_TITLE}"
        puts "Aborting downloads from #{DECORPOT_TITLE}"
      end
      if DECORPOT_UPLOADS.length > 0
        #show_wikihouse_error "Aborting uploads to #{WIKIHOUSE_TITLE}"
        puts "Aborting uploads to #{DECORPOT_TITLE}"
      end
    end 
  end

  # Load Handler
  # ------------------------------------------------------------------------------
  # (Chris) For loading Wikihouse models via web?
  
  class DecorpotLoader
  
    attr_accessor :cancel, :error
  
    def initialize(name)
      @cancel = false
      @error = nil
      @name = name
    end
  
    def cancelled?
      @cancel
    end
  
    def onFailure(error)
      @error = error
      Sketchup.set_status_text ''
    end
  
    def onPercentChange(p)
      Sketchup.set_status_text "LOADING #{name}:    #{p.to_i}%"
    end
  
    def onSuccess
      Sketchup.set_status_text ''
    end
  
  end

  
end
