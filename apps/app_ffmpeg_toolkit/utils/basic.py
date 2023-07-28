import os
import json
import re
import subprocess


class Basic:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.abspath(__file__))
        self.data_dir = f"{self.base_dir}/data"
        self.storage_dir = f"{self.base_dir}/storage"
        self.generate_dir(self.storage_dir)
        self.commands = self.refresh_commands()
        
    def generate_dir(self, dir):
        if not os.path.exists(dir):
            os.mkdir(dir)

    def refresh_commands(self):
        ffmpeg_commands_dir = f"{self.base_dir}/data/ffmpeg_commands.json"
        ffmpeg_commands_file = open(ffmpeg_commands_dir, 'r')

        ffmpeg_commands_json = json.load(ffmpeg_commands_file)
        return ffmpeg_commands_json

    def apply(self, identification_code, en_name, params, file_name, file_chunks):
        self.apply_dir = f"{self.storage_dir}/{str(identification_code)}"
        self.generate_dir(self.apply_dir)
        # 保存文件到本地
        file_write = open(f"{self.apply_dir}/{file_name}", "wb+")
        for chunk in file_chunks:
            file_write.write(chunk)
        # 找到需要执行的指令
        line = ""
        for command in self.commands:
            if en_name == command["en_name"]:
                line = command["line"]
        
        # 添加指令内容补足input和output名称
        params = eval(params)
        params_str = str(params).replace(" ", "").replace(",", "").replace("'", "").replace(":", "").replace("{", "").replace("}", "")
        params["output"] = f"{self.apply_dir}/{os.path.splitext(file_name)[0]}[{params_str}]"
        params["input"] = f"{self.apply_dir}/{file_name}"
        
        # 运行指令（实时输出指令执行内容）
        exec_line = line.format(**params)
        print(exec_line)
        process = subprocess.Popen(exec_line, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

        while True:
            output = process.stdout.readline()
            if output == b'' and process.poll() is not None:
                break
            if output:
                print(output.strip().decode('utf-8'))

        rc = process.poll()
        
