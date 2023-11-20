import torch
from PIL import Image 
import io
from torchvision import transforms
import torch.nn as nn
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

model = torch.load('saved_model.pt')
model.eval()
transform = transforms.Compose([
    transforms.PILToTensor(),
    transforms.Resize((48, 64))
])

def get_preds(img):
    inp = transform(img)
    with torch.no_grad(): 
        output = model.forward(inp.type(torch.float).unsqueeze(0))
        # print(output)
        preds = nn.functional.softmax(output)
    return preds.tolist()[0]

@app.route('/')
def hello():
    return 'Hello, World!'


@app.route('/img', methods=["POST"])
@cross_origin()
def img():
    # print(request.files)
    # print(request.files.to_dict())
    # print(type(request.files.to_dict()['file'].read()))
    file = request.files.to_dict()['file']
    # file.save(file.filename)
    # print(file.headers)
    img_bytes = file.read()
    p_img = Image.open(io.BytesIO(img_bytes))
    # p_img.save('tmp.png')
    preds = get_preds(p_img)
    print(preds)
    f = request.form
    print(f.to_dict())
    # print(request.to_dict())
    # title = request.json['title']
    res = {}
    res['preds'] = preds
    return jsonify(res)