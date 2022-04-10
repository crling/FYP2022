# frozen_string_literal: true

require 'socket'
require 'singleton'

module LocalApi
  HOST = 'localhost'
  PORT = 25258

  module EntryPoint
    CREATE_PROJECT = 'create_project'
    RUN_PIPELINE = 'run_pipeline'
    RUN_MODULE = 'run_module'
    TASK_INFO = 'task_info'
  end

  module Error
    class ApiError < ::StandardError; end

    class UnknownDataError < ApiError
      def message
        'Unknown data or empty request message. This could be an internal error.'
      end
    end

    class UnknownBodyError < ApiError
      def message
        'Cannot decode message body. This could be an internal error.'
      end
    end

    class UnknownEntryPointError < ApiError
      def message
        'Unknown entry point.'
      end
    end

    class IncorrectFormatError < ApiError
      def initialize(msg)
        @message = msg
      end

      def message
        "Incorrect request format: #{@message}"
      end
    end

    class InternalError < ApiError
      def initialize(msg)
        @message = msg
      end

      def message
        "Internal error: #{@message}"
      end
    end
  end

  module MessageProtocol
    def read_from_socket(socket)
      # read length
      len = socket.recv(8, Socket::MSG_WAITALL).to_i(16)
      raise Error::UnknownDataError if len.zero?
      # read body
      body = socket.recv(len)
      begin
        return JSON.parse body
      rescue JSON::ParserError
        raise Error::UnknownBodyError
      end
    end

    def write_to_socket(socket, message)
      json_str = JSON.dump message
      socket.send format('%08x%s', json_str.bytesize, json_str), 0
    end

    def write_error(socket, message)
      write_to_socket socket, status: 'error', message: message
    end

    def write_success(socket, message)
      write_to_socket socket, status: 'success', message: message
    end
  end

  class Client
    include MessageProtocol

    def create_project(uid, name)
      connect do |server|
        write_to_socket server,
                        entry_point: EntryPoint::CREATE_PROJECT,
                        arguments: { uid: uid, name: name }
        read_from_socket server
      end
    end

    def run_pipeline(uid, proj_id, pipeline_id, inputs, params)
      connect do |server|
        write_to_socket server,
                        entry_point: EntryPoint::RUN_PIPELINE,
                        arguments: { uid: uid, proj_id: proj_id, pipeline_id: pipeline_id, inputs: inputs, params: params }
        read_from_socket server
      end
    end

    def run_module(uid, proj_id, app_id, inputs, params)
      connect do |server|
        write_to_socket server,
                        entry_point: EntryPoint::RUN_MODULE,
                        arguments: { uid: uid, proj_id: proj_id, app_id: app_id, inputs: inputs, params: params }
        read_from_socket server
      end
    end

    def task_info(uid, tid, type)
      connect do |server|
        write_to_socket server,
                        entry_point: EntryPoint::TASK_INFO,
                        arguments: { uid: uid, tid: tid, type: type }
        read_from_socket server
      end
    end

    private

    def connect
      yield TCPSocket.new HOST, PORT
    rescue
      { status: 'error', message: "Cannot connect to #{HOST}:#{PORT}." }
    end
  end

  def self.port_open?
    !system("lsof -i:#{PORT}", out: '/dev/null')
  end
end
