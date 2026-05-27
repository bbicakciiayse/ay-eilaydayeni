import { useState } from "react";
import Sidebar from "../components/layout/Sidebar.jsx";
import Navbar from "../components/layout/Navbar.jsx";
import UploadBox from "../components/upload/UploadBox.jsx";
import DataPreviewTable from "../components/upload/DataPreviewTable.jsx";
import TargetColumnSelector from "../components/upload/TargetColumnSelector.jsx";
import MetricSelector from "../components/training/MetricSelector.jsx";
import ModelMetricsCards from "../components/training/ModelMetricsCards.jsx";
import ConfusionMatrix from "../components/training/ConfusionMatrix.jsx";
import FeatureImportance from "../components/training/FeatureImportance.jsx";
import PredictionForm from "../components/prediction/PredictionForm.jsx";
import PredictionResultCard from "../components/prediction/PredictionResultCard.jsx";
import SensitivityHeroCard from "../components/sensitivity/SensitivityHeroCard.jsx";
import PriceSlider from "../components/sensitivity/PriceSlider.jsx";
import SensitivityCharts from "../components/sensitivity/SensitivityCharts.jsx";
import { api } from "../services/api.js";

export default function MainPricingAnalysisPage({ onNavigate }) {
  const [dataset, setDataset] = useState(null);
  const [targetColumn, setTargetColumn] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("Best Overall");
  const [trainingResult, setTrainingResult] = useState(null);
  const [inputSchema, setInputSchema] = useState(null);
  const [predictionValues, setPredictionValues] = useState({});
  const [predictionResult, setPredictionResult] = useState(null);
  const [sensitivityResult, setSensitivityResult] = useState(null);
  const [minPrice, setMinPrice] = useState(10000);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [stepSize, setStepSize] = useState(5000);
  const [selectedPrice, setSelectedPrice] = useState(24000);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isTraining, setIsTraining] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleUpload = async (file) => {
    setError("");
    setStatus("Uploading dataset...");
    setIsUploading(true);
    try {
      const uploaded = await api.uploadData(file);
      setDataset(uploaded);
      const defaultTarget = uploaded.columns.find((column) => column.toLowerCase() === "result") || uploaded.columns[0] || "";
      setTargetColumn(defaultTarget);
      setTrainingResult(null);
      setInputSchema(null);
      setPredictionValues({});
      setPredictionResult(null);
      setSensitivityResult(null);
      setStatus("Dataset uploaded. Select the target column and train the model.");
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinueTarget = async () => {
    setError("");
    try {
      await api.selectTarget({ target_column: targetColumn });
      setStatus(`Target column selected: ${targetColumn}`);
    } catch (targetError) {
      setError(targetError.message);
    }
  };

  const handleTrain = async () => {
    setError("");
    setStatus("Training notebook model. This may take a while because the original notebook CV flow is preserved.");
    setIsTraining(true);
    try {
      const result = await api.train({ target_column: targetColumn, metric: selectedMetric });
      const schema = await api.modelInputSchema();
      const defaults = Object.fromEntries(schema.fields.map((field) => [field.name, field.default ?? ""]));
      setTrainingResult(result);
      setInputSchema(schema);
      setPredictionValues(defaults);
      setPredictionResult(null);
      setSensitivityResult(null);
      setStatus("Training complete. Prediction form was generated from model input columns.");
    } catch (trainError) {
      setError(trainError.message);
    } finally {
      setIsTraining(false);
    }
  };

  const handlePredictionValueChange = (name, value) => {
    setPredictionValues((current) => ({ ...current, [name]: value }));
    if (inputSchema?.price_column === name) {
      setSelectedPrice(Number(value) || selectedPrice);
    }
  };

  const handlePredict = async () => {
    setError("");
    setStatus("Running prediction...");
    setIsPredicting(true);
    try {
      const result = await api.predict({ values: predictionValues });
      setPredictionResult(result);
      setSelectedPrice(Number(result.price || selectedPrice));
      setStatus("Prediction complete.");
    } catch (predictError) {
      setError(predictError.message);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleAnalyzeSensitivity = async () => {
    setError("");
    setStatus("Calculating price sensitivity...");
    setIsAnalyzing(true);
    try {
      const values = {
        ...predictionValues,
        ...(inputSchema?.price_column ? { [inputSchema.price_column]: selectedPrice } : {}),
      };
      const result = await api.priceSensitivity({
        values,
        min_price: Number(minPrice),
        max_price: Number(maxPrice),
        step_size: Number(stepSize),
        selected_price: Number(selectedPrice),
      });
      setSensitivityResult(result);
      setStatus("Price sensitivity analysis complete.");
    } catch (sensitivityError) {
      setError(sensitivityError.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveReport = async () => {
    if (!predictionResult) {
      setError("Run a prediction before saving a report.");
      return;
    }

    setError("");
    try {
      await api.saveResult({
        ...predictionResult,
        selected_price: Number(selectedPrice),
        sensitivity_summary: {
          optimum_price: sensitivityResult?.optimum_price || null,
          risk_zone: sensitivityResult?.risk_zone || null,
        },
      });
      setStatus("Report saved successfully.");
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  return (
    <div className="app-shell">
      <Sidebar active="analysis" onNavigate={onNavigate} />
      <main className="content">
        <Navbar title="Pricing Analysis" badge="Model Workspace" />
        {(status || error) && (
          <div className={`card ${error ? "error-card" : "status-card"}`}>
            {error || status}
          </div>
        )}
        <div className="grid">
          <section className="card">
            <h2>Upload CRM or Excel Data</h2>
            <p>Upload your sales opportunity dataset to train your win/loss prediction model.</p>
            <UploadBox onUpload={handleUpload} isUploading={isUploading} />
            {dataset && (
              <div className="grid four">
                <div className="card">Dataset: {dataset.filename}</div>
                <div className="card">Rows: {dataset.rows}</div>
                <div className="card">Columns: {dataset.columns.length}</div>
                <div className="card">Detected: {dataset.columns.slice(0, 4).join(", ")}</div>
              </div>
            )}
            <DataPreviewTable rows={dataset?.preview || []} />
          </section>

          <section className="card">
            <h2>Select Target Column</h2>
            <p>Choose the column that represents the final deal outcome.</p>
            <TargetColumnSelector
              columns={dataset?.columns || []}
              value={targetColumn}
              onChange={setTargetColumn}
              onContinue={handleContinueTarget}
              disabled={!dataset}
            />
          </section>

          <section className="card">
            <h2>Train Win/Loss Prediction Model</h2>
            <p>Select the evaluation metric and train the model.</p>
            <MetricSelector
              value={selectedMetric}
              onChange={setSelectedMetric}
              onTrain={handleTrain}
              disabled={!dataset || !targetColumn}
              isTraining={isTraining}
            />
            <ModelMetricsCards trainingResult={trainingResult} />
            <div className="grid two">
              <ConfusionMatrix />
              <FeatureImportance />
            </div>
          </section>

          <section className="card">
            <h2>Predict Pricing Opportunity</h2>
            <p>Form fields are generated from the trained model input columns.</p>
            <PredictionForm
              schema={inputSchema}
              values={predictionValues}
              onChange={handlePredictionValueChange}
              onPredict={handlePredict}
              disabled={!inputSchema}
              isPredicting={isPredicting}
            />
            <PredictionResultCard result={predictionResult} />
          </section>

          <section className="card">
            <h2>Price Sensitivity Analysis</h2>
            <div className="grid two">
              <SensitivityHeroCard
                predictionResult={predictionResult}
                sensitivityResult={sensitivityResult}
                selectedPrice={Number(selectedPrice)}
              />
              <PriceSlider
                minPrice={minPrice}
                maxPrice={maxPrice}
                stepSize={stepSize}
                selectedPrice={selectedPrice}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                onStepSizeChange={setStepSize}
                onSelectedPriceChange={setSelectedPrice}
                onAnalyze={handleAnalyzeSensitivity}
                onSaveReport={handleSaveReport}
                disabled={!predictionResult}
                isAnalyzing={isAnalyzing}
              />
            </div>
            <SensitivityCharts sensitivityResult={sensitivityResult} selectedPrice={Number(selectedPrice)} />
          </section>
        </div>
      </main>
    </div>
  );
}
