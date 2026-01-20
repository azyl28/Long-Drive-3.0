
import { GoogleGenAI } from '@google/genai';
import type { Trip, Vehicle, Driver } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    console.warn("API key for Gemini not found. Generative features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY, vertexai: true });

export const generateTripSummary = async (trip: Trip, vehicle: Vehicle, driver: Driver): Promise<string> => {
    if (!API_KEY) {
        return "Funkcja podsumowania jest niedostępna. Brak klucza API.";
    }

    const model = 'gemini-2.5-flash';

    const prompt = `
        Jesteś asystentem do zarządzania flotą pojazdów. Twoim zadaniem jest stworzenie zwięzłego, profesjonalnego podsumowania zakończonego przejazdu służbowego w języku polskim.

        Dane przejazdu:
        - Pojazd: ${vehicle.make} ${vehicle.model} (${vehicle.registrationNumber})
        - Kierowca: ${driver.name}
        - Trasa: Od ${trip.routeFrom} do ${trip.routeTo}
        - Data rozpoczęcia: ${new Date(trip.startDate).toLocaleString('pl-PL')}
        - Data zakończenia: ${trip.endDate ? new Date(trip.endDate).toLocaleString('pl-PL') : 'N/A'}
        - Przebieg początkowy: ${trip.startMileage} km
        - Przebieg końcowy: ${trip.endMileage} km
        - Dystans: ${trip.distance} km
        - Zużyte paliwo (szacunkowo): ${trip.fuelUsed?.toFixed(2)} L
        - Dotankowano: ${trip.fuelAdded || 0} L

        Wygeneruj podsumowanie w formacie Markdown, które będzie czytelne i zwięzłe. Skup się na kluczowych informacjach.
        Przykład:

        **Podsumowanie przejazdu #${trip.id.slice(-5)}**

        *   **Pojazd:** [Marka Model (Nr Rej.)]
        *   **Kierowca:** [Imię i Nazwisko]
        *   **Trasa:** [Skąd -> Dokąd]
        *   **Okres:** [Data i godzina rozpoczęcia] - [Data i godzina zakończenia]
        *   **Dystans:** [Dystans] km
        *   **Zużycie paliwa:** [Zużycie] L
    `;

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: { role: 'user', parts: [{ text: prompt }] },
            config: {
                temperature: 0.2,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating trip summary with Gemini:", error);
        return "Wystąpił błąd podczas generowania podsumowania.";
    }
};
