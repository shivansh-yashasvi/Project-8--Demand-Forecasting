# Project-8--Demand-Forecasting
<br>

## Prediction of Energy Consumption using Machine Learning
This project uses machine learning to predict energy consumption. It uses three datasets: historical data, weather forecast, and building data.

### Historical Data
The historical data contains the following information:
<ul>
 <li> Timestamp: The time of the measurement </li> 
 <li> Value: A measure of consumption for that building </li>
</ul> 

### Weather Forecast
The weather forecast contains the following information:
<ul>
 <li> Timestamp: The time of the measurement </li>
 <li> Temperature: The temperature as measured at the weather station </li>
</ul> 

### Building Data
The building data contains the following information:
<ul>
<li> DAY_OF_WEEKIsDayOff: True if DAY_OF_WEEK is not a working day
 Number of employees everyday </li> </ul>

## FEATURE EXTRACTION:
<ul>
 <li> <b> Feature Extraction:</b> In this phase we need to validate the predictive power of new features as well as existing features. There are many techniques applied to validate the feature importance such as correlation analysis, ensemble and tree based model based feature importance. </li>

 <li> <b>Feature Transformation/Derivation:</b> during the validation with a baseline model some of the feature may require transformation. These transformations include log transformation, Standard Scaling (SS) and Min Max Scaling (MMS).  After literature survey and consultation with subject matter expert, a set of most desirable features for electricity load/consumption forecasting were listed.  :<br>
a) Past consumption pattern: electrical consumption pattern cannot change abruptly until unless some major changes happen at the place. So past consumption pattern carries information for future consumption pattern.  <br>
b) Calendar:  month, day of week <br>
c) Demography: The population of building can affect the consumption pattern <br>
d) Geography:, temperature, etc. If temperature is high, people will use more electrical appliance and similarly when temperature is low. <br>
 </li> </ul> 
 
## Algorithms and Models to be Used for the Prediction Analysis
The following algorithms and models will be used for the prediction analysis:
<ul>
 <li>Linear Regression </li>
 <li> LSTM (or long-short term memory networks) </li> </ul>

## Results
The results of the prediction analysis are -
<table>
  <thead>
    <tr>
      <th>Algorithm</th>
      <th>MAE</th>
      <th>MSE</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Linear Regression</td>
      <td>11.32</td>
      <td>3.45</td>
    </tr>
    <tr>
      <td>LSTM</td>
      <td>0.45</td>
      <td>0.002</td>
    </tr>
  </tbody>
</table>

As we can see, the LSTM model performs better than the Linear Regression model.

### Further Development
This project can be further developed by using more datasets and more advanced machine learning algorithms


