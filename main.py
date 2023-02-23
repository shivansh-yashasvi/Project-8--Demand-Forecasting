import os
import pandas as pd
import numpy as np
import datetime
import matplotlib.pyplot as plt
import pickle
import copy
import torch
import wandb

import constants
import utils
import stats
import model
import map_utils


def experimentation():
    stats.examine_acf()
    stats.examine_daily_averages_for_each_year()
    stats.examine_daily_averages_for_each_year()

    stats.examine_schools_impact()
    stats.examine_ramazan_impact()
    stats.examine_covid_impact()
    stats.examine_daily_averages_for_each_year()


def development():

    # utils.read_pjm_data(start_year=2022, end_year=2022)
    map_utils.visualize_pjm_stations()

    dummy = -32


def train(data_resolution, df_train, df_validation):
    model_params = {constants.HOURLY: {constants.INPUT_SEQUENCE_LENGTH: 168,
                                       constants.OUTPUT_SEQUENCE_LENGTH: 24,
                                       constants.NUMBER_OF_ENCODER_LAYERS: 1,
                                       constants.HIDDEN_LAYER_SIZE: 256,
                                       constants.TEACHER_FORCING_PROB: 0.50,
                                       constants.NUMBER_OF_EPOCHS: 15},
                    constants.DAILY: {constants.INPUT_SEQUENCE_LENGTH: 49,
                                      constants.OUTPUT_SEQUENCE_LENGTH: 7,
                                      constants.NUMBER_OF_ENCODER_LAYERS: 1,
                                      constants.HIDDEN_LAYER_SIZE: 256,
                                      constants.TEACHER_FORCING_PROB: 0.50,
                                      constants.NUMBER_OF_EPOCHS: 1}}

    train_params = {constants.HOURLY: {constants.INPUT_SEQUENCE_LENGTH: 168,
                                       constants.OUTPUT_SEQUENCE_LENGTH: 24},
                    constants.DAILY: {constants.INPUT_SEQUENCE_LENGTH: 49,
                                      constants.OUTPUT_SEQUENCE_LENGTH: 7}}

    model_handler = model.ModelHandler(model_params=model_params[data_resolution])
    # model_handler.train(df_train=df_train,
    #                     df_validation=df_validation,
    #                     data_resolution=data_resolution,
    #                     param_dict=train_params[data_resolution])

    start_date = '2017-01-01'
    end_date = '2022-09-30'

    df_hourly = utils.read_demand_data(start_date=start_date,
                                       end_date=end_date,
                                       data_folder=constants.EPIAS_FOLDER)

    model_handler.train_k_fold(df=df_hourly,
                               data_resolution=data_resolution,
                               num_train_months=12,
                               num_val_months=6,
                               months_stride=6)


def test(data_resolution, df_test):
    model_file_path_list = ['model_handler_2022-07-13 14:12:01.879651.pkl',
                            'model_handler_2022-07-13 16:46:40.140531.pkl',
                            'model_handler_2022-07-13 19:21:10.328384.pkl',
                            'model_handler_2022-07-13 21:55:26.928405.pkl',
                            'model_handler_2022-07-14 00:28:32.513635.pkl',
                            'model_handler_2022-07-14 03:02:42.920955.pkl',
                            'model_handler_2022-07-14 05:35:06.259790.pkl',
                            'model_handler_2022-07-14 08:09:39.471745.pkl',
                            'model_handler_2022-07-14 10:44:07.685136.pkl',
                            'model_handler_2022-07-14 13:17:48.144201.pkl',
                            'model_handler_2022-07-14 15:51:22.106755.pkl',
                            'model_handler_2022-07-14 18:26:10.524638.pkl',
                            'model_handler_2022-07-14 21:00:35.171787.pkl',
                            'model_handler_2022-07-14 23:35:12.881689.pkl',
                            'model_handler_2022-07-15 02:09:18.373973.pkl']

    percent_error_after_each_epoch = np.zeros([len(model_file_path_list), 1])
    percent_error_vec_after_each_epoch = np.zeros([len(model_file_path_list), 24])

    for idx, model_file_name in enumerate(model_file_path_list):
        print(f'Epoch: {idx + 1} -- {model_file_name} @ {datetime.datetime.now()}')
        model_file_path = os.path.join(constants.OUT_FOLDER, model_file_name)
        handler = model.ModelHandler(model_params=None)
        handler.load_model(model_file_path=model_file_path)

        error_matrix = handler.predict(df_test_data=df_test)
        percent_error_matrix = error_matrix * 100
        percent_error_vec = np.mean(percent_error_matrix[168:2160, :], axis=0)
        percent_error_vec_after_each_epoch[idx, :] = percent_error_vec
        percent_error = np.mean(percent_error_vec)
        percent_error_after_each_epoch[idx] = percent_error
        print(f'Percent Error: {percent_error}')

    model_file_path = './out/model_handler_2022-07-15 02:09:18.373973.pkl'
    handler = model.ModelHandler(model_params=None)
    handler.load_model(model_file_path=model_file_path)

    '''
    number_of_epochs = handler.train_loss_matrix.shape[0]
    df = pd.DataFrame(data=handler.train_loss_matrix.transpose())
    df_val = pd.DataFrame(data=handler.validation_loss_matrix.transpose())
    plt.figure(figsize=(18, 8)), plt.plot(df.rolling(240).mean()), plt.grid(visible=True), plt.legend(), plt.show()

    df_train_loss = pd.DataFrame(pd.concat([df[0], df[1], df[2], df[3], df[4],
                                            df[5], df[6], df[7], df[8], df[9],
                                            df[10], df[11], df[12], df[13], df[14]], ignore_index=True))

    plt.figure(figsize=(18, 8))

    for epoch in range(number_of_epochs):
        plt.plot(handler.train_loss_matrix[epoch, :], label=f'Epoch {epoch+1}')

    plt.grid(visible=True)
    plt.legend()
    plt.show()

    '''

    dummy = -32


def main(params):
    print(params['name'])

    # data_resolution = constants.HOURLY
    # df_dict = utils.train_test_val_split(data_resolution=data_resolution)

    # experimentation()
    development()
    # train(data_resolution=data_resolution, df_train=df_dict[constants.TRAIN], df_validation=df_dict[constants.VALIDATION])
    # test(data_resolution=data_resolution, df_test=df_dict[constants.TEST])

    dummy = -32


if __name__ == '__main__':
    parameters = {'name': 'Electricity Demand Forecasting'}

    print('------------------')
    print(f'STARTED EXECUTION @ {datetime.datetime.now()}')
    print('------------------')

    main(params=parameters)

    print('------------------')
    print(f'FINISHED EXECUTION @ {datetime.datetime.now()}')
    print('------------------')
