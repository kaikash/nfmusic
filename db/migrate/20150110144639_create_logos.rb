class CreateLogos < ActiveRecord::Migration
  def change
    create_table :logos do |t|
    	t.string :logo_big
    	t.string :logo_med
    	t.string :logo_small
    	t.string :type
      t.timestamps
    end
  end
end
