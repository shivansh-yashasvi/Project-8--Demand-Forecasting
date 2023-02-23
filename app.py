import pandas as pd
import time
import joblib
import numpy as np
import os, webbrowser
import matplotlib
import matplotlib.pyplot as plt
from functools import lru_cache
matplotlib.use('Agg')

from flask import Flask, request, jsonify, send_file, render_template
from flask_cors import CORS, cross_origin

###############################################################################
app = Flask(__name__,
            static_url_path='', 
            static_folder='static',
            template_folder='templates')


CORS(app, support_credentials=True)
app.config['SECRET_KEY'] =  os.urandom(24)

forecast_df = pd.DataFrame()
mdl_path = 'model/demand_forecast_mdl_29092022.pkl'

@lru_cache
def load_model(path):
    model = joblib.load(path)

    return model

def getPredResult(df):
    global forecast_df
    print('\n ====== Predict function ======= \n')
    
    #Load model pickle file
    demand_forecast_mdl = load_model(mdl_path)

    cols = [col for col in df.columns if col not in ['date', 'id', "sales", "year", "store_name", "item_name", "month"]]
 
    #Get test dataset
    test = df.loc[df.sales.isna()]
    X_test = test[cols]

    #Get Predictions    
    test_preds = demand_forecast_mdl.predict(X_test, num_iteration=demand_forecast_mdl.best_iteration)

    # predict_output_path = "./output/sales_forecast_3mnths.csv"

    forecast_df = pd.DataFrame({"date":test["date"],
                            "month":test["month"],
                            "store":test["store_name"],
                            "item":test["item_name"],
                            "sales":np.round(test_preds)
                            })

    response = {'status': 'success', 'predResult':forecast_df.sample(frac=0.1).to_dict(orient = 'records')}
    
    return response


###############################################################################
###  Render Index html  ###
###############################################################################
@app.route("/", methods=['GET'])
@cross_origin(supports_credentials=True)
def index():
    print(" === Displaying home page === ")
    
    return render_template('index.html')

###############################################################################
@app.route("/preview", methods=['POST'])
@cross_origin(supports_credentials=True)
def preview_api():
    print('\n ===== Preview ===== \n')
    start_time = time.time()
    file_path = 'output/test_preview.csv'
    
    file = request.files['file']
    print(file)
    file.save(file_path)

    dataset = pd.read_csv(file_path)
  
    response = {'status': 'success','dataset': dataset.sample(1000).to_dict(orient = 'records')}
    
    end_time = time.time()
    print('Time Required : ', end_time -start_time)
    return response

###############################################################################
@app.route("/predict", methods=['POST'])
@cross_origin(supports_credentials=True)
def predict_api():
    print('\n ===== Predict ===== \n')
    start_time = time.time()
    file_path = 'output/test_pred.csv'
    
    file = request.files['file']
    print(file)
    file.save(file_path)
    
    dataset = pd.read_csv(file_path)

    response = getPredResult(dataset)
    end_time = time.time()
    print('Time Required: ', end_time -start_time)
    return response

###############################################################################
@app.route("/filter", methods=['POST'])
@cross_origin(supports_credentials=True)
def filter_api():
    print('\n ===== filter ===== \n')

    filter_csv = 'input/filter_result.csv'
    start_time = time.time()

    df = pd.read_csv(filter_csv)

    filter_df = df.copy()
    filter_df['sales_round'] = filter_df['sales'].map(lambda x : np.round(x))
    filter_df.drop(['sales'], axis=1, inplace=True)

    filter_df.rename(columns={'sales_round': 'sales'}, inplace=True)

    filter_plot_df = df.copy()

    date = str(request.form.get("date"))
    item = str(request.form.get("item"))
    store = str(request.form.get("store"))

    plot_name = f'{store}_{item}.jpeg'

    plot_path = f'static/images/plots/{plot_name}'

    print(date, item, store)

    filter_df = filter_df[(filter_df.date >= date) & (filter_df.item == item) & (filter_df.store == store)]

    filter_plot_df = filter_plot_df[(filter_plot_df.date >= date) & (filter_plot_df.item == item) & (filter_plot_df.store == store)]
    filter_plot_df.set_index("date").sales.plot(color = "green",
                                             legend=True,
                                             figsize=(20, 10),
                                             label = f"{store}, {item}")

    # plt.legend(bbox_to_anchor=(1., 1.), loc='upper right', ncol=1, frameon=True)
    plt.xticks(fontsize=13)
    plt.yticks(fontsize=13)
    plt.xticks(rotation =30)
    plt.tight_layout()
    plt.savefig(plot_path, bbox_inches='tight')
    plt.close()

    response = {'status': 'success','filterDf': filter_df.to_dict(orient = 'records'), 'plot_path': plot_path}

    end_time = time.time()
    print('Time Required: ', end_time -start_time)

    return response

############################################################################################
######### GET API for Downloads
############################################################################################
@app.route('/downloadPredictedCSV', methods=['GET'])
@cross_origin(supports_credentials=True)
def downloadCSV():
    print('Enter to download latest data...')
    predicted_filename = 'output/predict_result.csv'
    latest_data = forecast_df.copy()
    latest_data.to_csv(predicted_filename, index= False)
    return send_file(predicted_filename, mimetype="text/csv", attachment_filename= predicted_filename.split('/')[-1])

###############################################################################
if __name__ == "__main__": 
    app.run(host='0.0.0.0')
    
###############################################################################
###############################################################################
###############################################################################