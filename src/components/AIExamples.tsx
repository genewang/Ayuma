import React, { useState } from 'react'
import { useAIMedicalQuery, useAIInsights } from '../hooks/useAI'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Loader2, MessageCircle, Lightbulb } from 'lucide-react'

// Example component demonstrating AI services integration
export function AIMedicalAssistant() {
  const [query, setQuery] = useState('')
  const [patientContext, setPatientContext] = useState({
    diagnosis: 'breast cancer',
    stage: 'Stage II',
    biomarkers: ['ER+', 'PR+', 'HER2-']
  })

  const { query: askAI, isLoading, error, lastResponse, clearResponse } = useAIMedicalQuery({
    onSuccess: (response) => {
      console.log('AI Response:', response)
    },
    onError: (error) => {
      console.error('AI Error:', error)
    },
    patientContext
  })

  const { getInsights, insights, isLoading: insightsLoading } = useAIInsights()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    await askAI(query)
  }

  const handleGetInsights = async () => {
    await getInsights(patientContext, 'treatment')
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">AI Medical Assistant</h2>
        <p className="text-muted-foreground">
          Get evidence-based medical information powered by AI
        </p>
      </div>

      {/* Patient Context Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Patient Context
          </CardTitle>
          <CardDescription>
            Current patient information used for AI queries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Diagnosis: {patientContext.diagnosis}</Badge>
            <Badge variant="outline">Stage: {patientContext.stage}</Badge>
            <Badge variant="outline">Biomarkers: {patientContext.biomarkers.join(', ')}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* AI Query Form */}
      <Card>
        <CardHeader>
          <CardTitle>Ask AI Assistant</CardTitle>
          <CardDescription>
            Ask questions about treatments, trials, medications, or get personalized insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="e.g., What are the recommended treatments for my condition?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !query.trim()}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ask AI
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* AI Response Display */}
      {lastResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              AI Response
            </CardTitle>
            <CardDescription>
              Response time: {lastResponse.processingTime}ms | Model: {lastResponse.modelUsed} | Confidence: {Math.round(lastResponse.confidence * 100)}%
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{lastResponse.answer}</div>
            </div>

            {/* Citations */}
            {lastResponse.citations.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Sources & Evidence:</h4>
                <div className="space-y-2">
                  {lastResponse.citations.map((citation, index) => (
                    <div key={index} className="flex items-start gap-2 text-sm border-l-2 border-muted pl-3">
                      <div>
                        <div className="font-medium">{citation.institution} Guidelines</div>
                        <div className="text-muted-foreground">{citation.source}</div>
                        <div className="text-xs text-muted-foreground">
                          Evidence Level: {citation.evidenceLevel} | Updated: {citation.lastUpdated}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error.message}</p>
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Insights
          </CardTitle>
          <CardDescription>
            Get personalized insights based on your medical profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGetInsights} disabled={insightsLoading}>
            {insightsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Get Treatment Insights
          </Button>

          {insights && (
            <div className="mt-4">
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap">{insights.answer}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Example Queries */}
      <Card>
        <CardHeader>
          <CardTitle>Example Queries</CardTitle>
          <CardDescription>
            Try these example questions to see the AI in action
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "What are the first-line treatments for my condition?",
              "Are there any clinical trials I should consider?",
              "What medications should I be aware of?",
              "What are the potential side effects of treatment?",
              "Are there any lifestyle changes that could help?",
              "What questions should I ask my doctor?"
            ].map((exampleQuery, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setQuery(exampleQuery)}
                className="justify-start text-left h-auto p-3"
              >
                {exampleQuery}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Example component for AI-powered treatment recommendations
export function AITreatmentRecommendations() {
  const [diagnosis, setDiagnosis] = useState('breast cancer')
  const [stage, setStage] = useState('Stage II')
  const [biomarkers, setBiomarkers] = useState(['ER+', 'PR+', 'HER2-'])

  const {
    getTreatmentRecommendations,
    recommendations,
    isLoading,
    error
  } = useAITreatmentPanel()

  const handleGetRecommendations = async () => {
    await getTreatmentRecommendations(diagnosis, stage, biomarkers)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Treatment Recommendations</CardTitle>
        <CardDescription>
          Get personalized treatment recommendations based on your diagnosis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Diagnosis</label>
            <Input
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g., breast cancer"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Stage</label>
            <Input
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              placeholder="e.g., Stage II"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Biomarkers</label>
            <Input
              value={biomarkers.join(', ')}
              onChange={(e) => setBiomarkers(e.target.value.split(', ').filter(Boolean))}
              placeholder="e.g., ER+, PR+, HER2-"
            />
          </div>
        </div>

        <Button onClick={handleGetRecommendations} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Get Recommendations
        </Button>

        {error && (
          <div className="text-destructive text-sm">
            Error: {error.message}
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Treatment Recommendations:</h4>
            {recommendations.map((rec, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="font-medium">{rec.treatment}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {rec.description}
                </div>
                <Badge variant="secondary" className="mt-2">
                  {rec.confidence} confidence
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Example component for AI-powered clinical trial matching
export function AITrialMatching() {
  const [location, setLocation] = useState('New York, NY')
  const [maxDistance, setMaxDistance] = useState(100)

  const {
    findMatchingTrials,
    matchedTrials,
    isLoading,
    error
  } = useAITrialMatching()

  const handleFindTrials = async () => {
    await findMatchingTrials({
      diagnosis: 'breast cancer',
      stage: 'Stage II',
      biomarkers: ['ER+', 'PR+', 'HER2-'],
      location: location,
      maxDistance: maxDistance
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Clinical Trial Matching</CardTitle>
        <CardDescription>
          Find relevant clinical trials using AI-powered matching
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Location</label>
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Max Distance (miles)</label>
            <Input
              type="number"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value) || 100)}
              placeholder="100"
            />
          </div>
        </div>

        <Button onClick={handleFindTrials} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Find Trials
        </Button>

        {error && (
          <div className="text-destructive text-sm">
            Error: {error.message}
          </div>
        )}

        {matchedTrials.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Matching Clinical Trials:</h4>
            {matchedTrials.map((trial, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="font-medium">{trial.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  NCT ID: {trial.nctId}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={trial.status === 'active' ? 'default' : 'secondary'}>
                    {trial.status}
                  </Badge>
                  <Badge variant="outline">
                    Eligibility: {Math.round(trial.eligibilityScore)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Example component for AI medication interaction checking
export function AIMedicationAssistant() {
  const [medications, setMedications] = useState(['tamoxifen', 'aspirin'])

  const {
    checkInteractions,
    interactions,
    isLoading,
    error
  } = useAIMedicationAssistant()

  const handleCheckInteractions = async () => {
    await checkInteractions(medications)
  }

  const addMedication = () => {
    setMedications([...medications, ''])
  }

  const updateMedication = (index: number, value: string) => {
    const updated = [...medications]
    updated[index] = value
    setMedications(updated)
  }

  const removeMedication = (index: number) => {
    setMedications(medications.filter((_, i) => i !== index))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Medication Safety Check</CardTitle>
        <CardDescription>
          Check for potential drug interactions using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Medications</label>
          {medications.map((medication, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={medication}
                onChange={(e) => updateMedication(index, e.target.value)}
                placeholder="Medication name"
              />
              {medications.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeMedication(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addMedication}>
            Add Medication
          </Button>
        </div>

        <Button onClick={handleCheckInteractions} disabled={isLoading || medications.length < 2}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Check Interactions
        </Button>

        {error && (
          <div className="text-destructive text-sm">
            Error: {error.message}
          </div>
        )}

        {interactions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Drug Interactions Found:</h4>
            {interactions.map((interaction, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="font-medium">
                  {interaction.medications.join(' + ')}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {interaction.description}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant={
                      interaction.severity === 'major' ? 'destructive' :
                      interaction.severity === 'moderate' ? 'default' : 'secondary'
                    }
                  >
                    {interaction.severity} interaction
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Management: {interaction.management}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
