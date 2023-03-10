# ProDiGi Energy Demand Forecast
## Table of Contents
* [Introduction](#introduction)
* [Data Analysis](#data-analysis)
  - [Examination of Covid-19 Impact](#examination-of-covid-19-impact)
  - [Examination of Schools' Impact](#examination-of-schools-impact)
  - [Extracted Features and Data Pre-Processing](#extracted-features-and-data-pre-processing)
* [Forecasting Algorithms](#forecasting-algorithms)

## Introduction
In the rapidly developing world, energy needs are increasing at the same pace. Since the industrial revolution, countries with access to energy resources have come to economically strong positions. On the other hand, the ever-increasing macro-economic and micro-economic competition between different entities is forcing the absolute need for efficient energy use in order to achieve economic efficacy and/or efficiency.

Electricity, being relatively easy to transmit, has had ever-increasing use globally. Switching the electricity production mainly from non-green to green processes increases its potential for sustainability-oriented development. On the other hand, the relative inefficiency and higher cost of storing electrical energy make the instant balancing of demand and supply extremely important. 

This project proposes an algorithm and implementation for forecasting hourly demand in the next 24-hour time frame. The forecasting system can be utilized by market players on the supply side and the regulatory bodies most interested in balancing the supply and demand. The system is trained and tested on Indian electricity market data and hence, very few features are special to India. Nevertheless the system can be utilized in any electricity market with minimal modifications (and re-training).

## Data Analysis

Data used in this project is obtained from Kaggle.

Hourly electricity demand data between 2017-01-01 and 2022-06-30 are utilized in this study. For a visual introduction, the following figure presents the hourly electricity consumption in India between 2022-04-01 and 2022-06-30.

![hourly_2022-04-01_2022-06-30](./images/hourly_2022-04-01_2022-06-30.png)

As seen in the above figure, the electricity consumption shows regular patterns, higher during business days than weekend days. The sharp drop at the beginning of May reflects the lower electricity usage during the Ramazan Feast.

The daily pattern in demand (in MWh) can be seen in the following figure.

![daily-average-consumptions](./images/daily-average-consumptions.png)

As expected, the business days have higher average consumption than weekend days. In addition, Saturdays, which are a working day in some companies, have higher average consumption than Sundays. On the other hand, the intra-day consumption stays at the highest level between 10 am and 8 pm.

### Examination of Covid-19 Impact

One recent question that deserves attention is whether the Covid-19 Pandemic impacts electricity consumption. For this purpose, the years 2017, 2018, and 2019 are labeled ???Before Covid???, whereas 2020 is marked as ???During Covid???. On the other hand, the years 2021 and 2022 are examined as ???After Covid.??? The following figure shows the daily averages (MWh) corresponding to those groups.

![daily-average-consumptions_covid](./images/daily-average-consumptions_covid.png)

Careful examination of the above figure reveals that the general pattern between business days and weekend days is preserved before, during, and after Covid. In addition, the consumption stays close to its peak level between 10 am and 8 pm in all of the sub-figures. However, there is a definite increase in the general level of electricity consumption after Covid, when compared with consumption before Covid and during Covid. 

Is this an impact of the Covid Pandemic, or is there already an increasing trend throughout the years? The following figure shows the average daily consumption for all years separately.

![daily-averages_all-years](./images/daily-averages_all-years.png)

A careful examination of the above figure reveals that there is not a clear increasing trend in consumption throughout 2017, 2018, and 2019. On the other hand, electricity consumption in 2021 is slightly higher than in 2022. Therefore, although the consumption after Covid (2021 & 2022) is higher than the consumption in previous years, any apparent reason could not be found in this analysis.

### Examination of Schools' Impact

One other interesting question to examine is whether schools have a significant impact on electricity consumption. For this purpose, the following figure shows the 7-day rolling average of daily electricity consumption for different years.

![schools-impact](./images/schools-impact.png)

Having a careful look at the above figure reveals an interesting relationship between school closure dates and electricity consumption. It is evident that electricity consumption generally is higher when the schools are closed. This can easily be explained by the fact that most of the school closures happen in summer when electricity consumption increases due to cooling needs. Although there is only a correlation but no causation relationship between schools and electricity consumption, this is most of the time more than enough for a machine learning algorithm which is the backbone of forecasting.

### Extracted Features and Data Pre-Processing

The following features are extracted for each data sample:

* week_day:
  - Monday:1
  - Tuesday:2
  - Wednesday:3
  - Thursday:4
  - Friday:5
  - Saturday:6
  - Sunday:7
* weekend:
  - 1 if the sample day is a weekend day
  - 0 else
* year:
  - year of the data sample
* month:
  - the month of the sample between [1, 12]
* day:
  - day of the sample within the month (between [1, 31])
* hour:
  - hour of the data sample between [0, 23]
* quarter:
  - January, February, March: 1
  - April, May, June: 2
  - July, August, September: 3
  - October, November, December: 4
* schools_closed:
  - 1 if the schools are on holiday
  - 0 else
* ramazan:
  - 1 if the sample is in Ramazan
  - 0 else
* holiday:
  - 1 if the day of the sample is on holiday (national or religious)
  - 0 else
* before_after_holiday:
  - 1 if the day of the sample is either just before or just after a holiday
  - 0 else
* bridge_day:
  - 1 if the day of the sample is a bridge day
  - 0 else

The whole data set is split as follows:

* __train set:__ [2017-01-01, 2021-12-31]
* __validation set:__ [2022-01-01, 2022-03-31]
* __test set:__ [2022-04-01, 2022-06-30]

For each sample, the consumption data is normalized to zero-mean and unit standard deviation. For this purpose, the mean and standard deviation computed over the training set is utilized. For the year feature, min-max scaling is applied.

Sine and cosine transforms are applied for the features week_day, month, day, hour, and quarter.

* week_day_sine = sin(2?? * week_day / 7)
* week_daycos = cos(2?? * week_day / 7)
* month_sine = sin(2?? * month / 12)
* month_cos = cos(2?? * month / 12)
* day_sine = sin(2?? * day / 31)
* day_cos = cos(2?? * day / 31)
* hour_sine = sin(2?? * hour / 24)
* hour_cos = cos(2?? * hour / 24)
* quarter_sine = sin(2?? * quarter / 4)
* quarter_cos = cos(2?? * quarter / 4)


## Forecasting Algorithms

Taking an ordered set of input samples and generating an ordered set of outputs is defined as sequence-to-sequence learning in the field of machine learning and has long been known, especially in natural language processing (NLP) domain). In recent years, there have been some studies that apply sequence-to-sequence learning to solve multi-step forecasting problems in time-series data. 

Sequence-to-sequence learning methods are studied in this project due to their superiority in multi-step forecasting problems.

### Encoder-Decoder Architecture

The general architecture of an encoder-decoder system can be viewed in the following figure). 

![encoder-decoder](https://miro.medium.com/max/700/1*62xsdc5F5DNdLXluQojeBg.png)

One important point to note is that this drawing is a ???time-unrolled??? scheme, meaning that there is only one GRU Cell in the Encoder and there is only one Decoder Cell in the Decoder. The GRU Cell and the Decoder Cell carries ???hidden state??? information from the previous time instant to the next. The advantage of using time-unrolled drawing in architectures that include recurrent neural networks (RNN) is that it improves understanding of the logic behind training. Encoder-Decoder architectures can be implemented with vanilla RNNs), Gated Recurrent Units (GRU) or Long Short-Term Memory RNNs (LSTM).

To have a general understanding, it will be beneficial to inspect the inner structure of vanilla RNN.


* $\sqrt{3x-1}+(1+x)^2$





