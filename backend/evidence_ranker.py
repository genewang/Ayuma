# evidence_ranker.py
from typing import List, Dict
import numpy as np
from datetime import datetime

class EvidenceBasedRanker:
    def __init__(self):
        self.evidence_hierarchy = self._initialize_evidence_hierarchy()
        self.institution_weights = self._initialize_institution_weights()

    def _initialize_evidence_hierarchy(self) -> Dict:
        return {
            "meta_analysis": 1.0,
            "systematic_review": 0.95,
            "rct": 0.9,
            "randomized_controlled_trial": 0.9,
            "cohort_study": 0.7,
            "prospective_cohort": 0.75,
            "retrospective_cohort": 0.65,
            "case_control": 0.6,
            "case_series": 0.5,
            "expert_opinion": 0.4,
            "guidelines": 0.85,
            "consensus_statement": 0.8,
            "animal_study": 0.2,
            "in_vitro": 0.1,
            "preclinical": 0.15
        }

    def _initialize_institution_weights(self) -> Dict:
        return {
            "ASCO": 1.0,
            "NCCN": 0.95,
            "ESMO": 0.9,
            "EULAR": 0.9,
            "FDA": 0.85,
            "NIH": 0.8,
            "EMA": 0.8,
            "WHO": 0.75,
            "CDC": 0.7,
            "AHRQ": 0.75,
            "COCHRANE": 0.95,
            "UPTODATE": 0.6,
            "PUBMED": 0.5,
            "CLINICALTRIALS": 0.8
        }

    def rank_documents(self, documents: List[Dict], query_entities: Dict) -> List[Dict]:
        """Rank documents based on evidence quality and relevance"""
        scored_documents = []

        for doc in documents:
            evidence_score = self._calculate_evidence_score(doc)
            relevance_score = self._calculate_relevance_score(doc, query_entities)
            timeliness_score = self._calculate_timeliness_score(doc)
            institution_score = self._calculate_institution_score(doc)

            # Combined score (weights can be adjusted)
            final_score = (
                evidence_score * 0.4 +        # Evidence quality (40%)
                relevance_score * 0.3 +       # Relevance to query (30%)
                timeliness_score * 0.15 +     # Recency (15%)
                institution_score * 0.15      # Institution prestige (15%)
            )

            scored_documents.append({
                **doc,
                "evidence_score": evidence_score,
                "relevance_score": relevance_score,
                "timeliness_score": timeliness_score,
                "institution_score": institution_score,
                "final_score": final_score
            })

        return sorted(scored_documents, key=lambda x: x["final_score"], reverse=True)

    def _calculate_evidence_score(self, document: Dict) -> float:
        """Calculate evidence quality score"""
        metadata = document.get("metadata", {})
        study_type = metadata.get("study_type", "").lower()
        evidence_level = metadata.get("evidence_level", "").lower()
        institution = metadata.get("institution", "").upper()

        # Base score from study type
        base_score = self.evidence_hierarchy.get(study_type, 0.3)
        evidence_score = self.evidence_hierarchy.get(evidence_level, base_score)

        # Adjust for institution prestige
        institution_boost = self._get_institution_boost(institution)

        # Adjust for sample size if available
        sample_size_boost = self._get_sample_size_boost(metadata.get("sample_size"))

        # Adjust for methodology quality indicators
        methodology_boost = self._get_methodology_boost(metadata)

        final_score = evidence_score + institution_boost + sample_size_boost + methodology_boost

        return min(final_score, 1.0)

    def _get_institution_boost(self, institution: str) -> float:
        """Get boost based on institution prestige"""
        return self.institution_weights.get(institution, 0.0)

    def _get_sample_size_boost(self, sample_size: int) -> float:
        """Get boost based on study sample size"""
        if not sample_size:
            return 0.0
        if sample_size > 10000:
            return 0.08
        elif sample_size > 5000:
            return 0.06
        elif sample_size > 1000:
            return 0.04
        elif sample_size > 500:
            return 0.02
        elif sample_size > 100:
            return 0.01
        return 0.0

    def _get_methodology_boost(self, metadata: Dict) -> float:
        """Get boost based on methodology quality indicators"""
        boost = 0.0

        # Randomization
        if metadata.get("randomized", False):
            boost += 0.05

        # Blinding
        if metadata.get("blinded", False) or metadata.get("double_blinded", False):
            boost += 0.03

        # Multicenter study
        if metadata.get("multicenter", False):
            boost += 0.02

        # Long-term follow-up
        if metadata.get("long_term_followup", False):
            boost += 0.02

        # Statistical significance reported
        if metadata.get("statistical_significance", False):
            boost += 0.01

        return boost

    def _calculate_relevance_score(self, document: Dict, query_entities: Dict) -> float:
        """Calculate relevance to query entities"""
        doc_entities = document.get("entities", {})
        relevance = 0.0

        # Direct entity matching
        for entity_type, entities in query_entities.items():
            if entities and doc_entities.get(entity_type):
                overlap = len(set(entities) & set(doc_entities[entity_type]))
                if overlap > 0:
                    relevance += overlap * 0.15  # Higher weight for direct matches

        # Semantic similarity (if available)
        doc_text = document.get("document", "").lower()
        query_text = " ".join([item for sublist in query_entities.values() for item in sublist]).lower()

        if doc_text and query_text:
            # Simple word overlap
            doc_words = set(doc_text.split())
            query_words = set(query_text.split())
            word_overlap = len(doc_words & query_words) / max(len(doc_words), 1)
            relevance += word_overlap * 0.1

        return min(relevance, 1.0)

    def _calculate_timeliness_score(self, document: Dict) -> float:
        """Calculate score based on document recency"""
        metadata = document.get("metadata", {})
        pub_date = metadata.get("publication_date", "")

        if not pub_date:
            return 0.5  # Neutral score for unknown dates

        try:
            # Handle different date formats
            if "-" in pub_date:
                if len(pub_date.split("-")[0]) == 4:  # YYYY-MM-DD
                    pub_datetime = datetime.strptime(pub_date, "%Y-%m-%d")
                else:  # MM-DD-YYYY
                    pub_datetime = datetime.strptime(pub_date, "%m-%d-%Y")
            else:
                # Try to parse as year only
                pub_datetime = datetime(int(pub_date), 1, 1)

            current_date = datetime.now()
            years_diff = (current_date - pub_datetime).days / 365.25

            # Score decreases with age, but more slowly for foundational studies
            if years_diff <= 1:
                return 1.0  # Very recent
            elif years_diff <= 2:
                return 0.9  # Recent
            elif years_diff <= 3:
                return 0.8  # Moderately recent
            elif years_diff <= 5:
                return 0.7  # Still relevant
            elif years_diff <= 10:
                return 0.5  # Moderately old
            else:
                return 0.3  # Old but potentially still relevant for foundational knowledge
        except:
            return 0.5

    def _calculate_institution_score(self, document: Dict) -> float:
        """Calculate score based on publishing institution"""
        metadata = document.get("metadata", {})
        institution = metadata.get("institution", "").upper()

        return self.institution_weights.get(institution, 0.5)

    def get_evidence_level_description(self, score: float) -> str:
        """Get human-readable evidence level description"""
        if score >= 0.9:
            return "Very High Quality Evidence"
        elif score >= 0.8:
            return "High Quality Evidence"
        elif score >= 0.7:
            return "Moderate Quality Evidence"
        elif score >= 0.5:
            return "Low Quality Evidence"
        else:
            return "Very Low Quality Evidence"

    def get_recommendation_strength(self, score: float) -> str:
        """Get recommendation strength based on evidence score"""
        if score >= 0.9:
            return "Strong Recommendation"
        elif score >= 0.8:
            return "Moderate Recommendation"
        elif score >= 0.6:
            return "Weak Recommendation"
        else:
            return "Insufficient Evidence"
