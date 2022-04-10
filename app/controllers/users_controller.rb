class UsersController < ApplicationController
    $user_stor_dir = "#{Rails.root}/data/user"

    def index
    end

    def show
        id = session[:user_id]
        @user = User.find(id)
    end

    def edit 
        id = session[:user_id]
        @user = User.find(id)
    end
    
    def update
        if @user.update user_params
            flash[:success] = "User settings updated."
            redirect_to root_path
        else
            flash[:error] = @user.errors.full_messages
            redirect_to edit_user_path(@user)
        end
    end


    def add_data_to_set(file_dict, dataset_name)
        id = session[:user_id]
        @user = User.find(id)
        user_dir = File.join($user_stor_dir, id)
        dataset_dir = File.join(user_dir, dataset_name)
        file_dict.keys.each do |key|
            file_path = File.join(dataset_dir, key)
            file = File.open(file_path, "w")
            file.write(file_dict[key])
            file.close
        end

    end

    private

    def user_params
        params.require(:user).permit(:genome_reference)
    end

    
end
