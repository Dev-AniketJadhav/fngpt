from flask import Flask, render_template, request, jsonify
import os
from langchain_experimental.agents import create_csv_agent
from langchain.llms import OpenAI
from langchain.document_loaders import CSVLoader
from langchain.indexes import VectorstoreIndexCreator
from langchain.chains import RetrievalQA
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

os.environ["OPENAI_API_KEY"] = "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"

loader = CSVLoader(file_path=r'C:\Users\Acer\Downloads\custom_invoice - custom_invoice.csv (1).csv')
index_creator = VectorstoreIndexCreator()
docsearch = index_creator.from_loaders([loader])
chain = RetrievalQA.from_chain_type(llm=OpenAI(model="gpt-3.5-turbo-instruct"), chain_type="stuff", retriever=docsearch.vectorstore.as_retriever(), input_key="question")

@app.route('/query', methods=['GET','POST'])
def handle_query():
    print(f"Received {request.method} request")
    data = request.get_json() 
    query = data.get('question')
    if not query:
        return jsonify({"error": "No question provided"}), 400
    
   
    response = chain({"question": query})
    return jsonify(response)  
if __name__ == '__main__':
    app.run(debug=True)