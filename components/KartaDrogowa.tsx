
import React from 'react';

interface KartaDrogowaData {
    numerKarty: string;
    data: string;
    pieczecJednostki: string;
    nrRejestracyjny: string;
    pojemnoscCylindrow: string;
    markaTyp: string;
    rodzajNadwozia: string;
    rodzajPaliwa: string;
    grupa: string;
    nrInwentarzowy: string;
    miejsceGarazowania: string;
    kierowca: string;
    godzinaRozpoczeciaPracy: string;
    godzinaZakonczeniaPracy: string;
    iloscGodzinPracy: string;
    podpisKierowcySprawny: string;
    podpisZlecajacegoWyjazd: string;
    podpisStwierdzajacegoPrzyjazd: string;
    paliwoStanPoczatkowy: number;
    paliwoPobrano: { gdzie: string; nrKwitu: string; ilosc: number }[];
    paliwoStanKoncowy: number;
    podpisWystawiajacegoKarte: string;
    normaZuzyciaPaliwa: number;
    zuzyciePaliwa: { wgNorm: number; rzeczywiste: number; oszczednosc: number; przekroczenie: number };
    wyjazd: { data: string; godzina: string; stanLicznika: number };
    powrot: { data: string; godzina: string; stanLicznika: number };
    wyniki: { czasPracy: string; przebiegKm: number };
    podpisKierowcyWyniki: string;
    podpisWynikiObliczyl: string;
    podpisKontroliWynikow: string;
}

interface KartaDrogowaProps {
    data: KartaDrogowaData;
}

export const KartaDrogowa = React.forwardRef<HTMLDivElement, KartaDrogowaProps>(({ data }, ref) => {
    const formColor = 'border-teal-600';
    const Field: React.FC<{ label: string; value: string | number; className?: string; valueClassName?: string }> = ({ label, value, className = '', valueClassName = '' }) => (
        <div className={`flex items-end space-x-1 ${className}`}>
            <span className="text-[9px] text-gray-700 whitespace-nowrap">{label}</span>
            <div className={`flex-grow border-b border-dotted border-gray-500 text-center text-[10px] font-medium ${valueClassName}`}>
                {value}
            </div>
        </div>
    );
    const LinedText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
        <div className={`w-full border-b border-dotted border-gray-500 text-center text-[10px] font-medium ${className}`}>
            {children || <>&nbsp;</>}
        </div>
    );

    return (
        <div ref={ref} className="p-4 bg-white shadow-lg karta-font">
            <div className={`w-[700px] border-2 ${formColor} grid grid-cols-12 text-gray-800`}>
                {/* Header */}
                <div className={`col-span-1 border-r ${formColor} p-1`}>
                    <div className="border border-gray-400 text-center text-xs py-1">TYP: 802-3</div>
                </div>
                <div className={`col-span-11 p-1 grid grid-cols-10`}>
                    <div className="col-span-8">
                        <h1 className="text-xl font-bold text-center">KARTA DROGOWA</h1>
                        <div className="flex justify-center items-end space-x-4 mt-2">
                            <Field label="Nr" value={data.numerKarty} className="w-40" />
                            <Field label="Data" value={data.data} className="w-40" />
                        </div>
                    </div>
                    <div className="col-span-2 border-l border-gray-400 pl-2 flex flex-col items-center justify-center">
                        <div className="font-bold text-lg">SM</div>
                        <div className={`border-2 ${formColor} font-bold text-xl p-1 w-full text-center`}>101</div>
                    </div>
                </div>

                {/* Vehicle Info */}
                <div className={`col-span-12 border-t-2 ${formColor} grid grid-cols-12`}>
                    <div className={`col-span-1 row-span-3 border-r ${formColor} flex items-center justify-center font-bold text-xl`}>3</div>
                    <div className="col-span-11 p-2 border-b border-dotted border-gray-400">
                        <LinedText className="text-left pl-20">{data.pieczecJednostki}</LinedText>
                        <div className="text-center text-[8px] mt-1">Pieczęć jednostki organizacyjnej</div>
                    </div>
                    <div className="col-span-11 p-2 grid grid-cols-2 gap-x-4 gap-y-2 border-b border-dotted border-gray-400">
                        <Field label="Samochód osobowy - specjalny - motocykl*) Nr rej." value={data.nrRejestracyjny} />
                        <Field label="Pojemność cylindrów" value={data.pojemnoscCylindrow} />
                        <Field label="Marka i typ" value={data.markaTyp} />
                        <Field label="Rodzaj nadwozia" value={data.rodzajNadwozia} />
                        <Field label="Rodzaj paliwa" value={data.rodzajPaliwa} />
                    </div>
                    <div className="col-span-11 p-2 grid grid-cols-3 gap-x-4">
                        <Field label="Grupa" value={data.grupa} />
                        <Field label="Nr inwent." value={data.nrInwentarzowy} />
                        <Field label="Miejsce garażowania" value={data.miejsceGarazowania} />
                    </div>
                </div>

                {/* Driver Info */}
                <div className={`col-span-12 border-t-2 ${formColor} grid grid-cols-12`}>
                    <div className={`col-span-1 border-r ${formColor} flex items-center justify-center font-bold text-xl`}>4</div>
                    <div className={`col-span-8 p-2 border-r ${formColor}`}>
                        <Field label="Imię i nazwisko kierowcy" value={data.kierowca} />
                    </div>
                    <div className="col-span-3 p-1">
                        <div className="text-center text-[9px]">Godzina</div>
                        <div className="grid grid-cols-2 text-center text-[9px] border-t border-b border-l border-r border-gray-400">
                            <div className="border-r border-gray-400 p-1">rozp. pracy</div>
                            <div className="p-1">uk. pracy</div>
                        </div>
                        <div className="grid grid-cols-2 text-center text-[10px] font-medium border-b border-l border-r border-gray-400 h-6">
                            <div className="border-r border-gray-400 flex items-center justify-center">{data.godzinaRozpoczeciaPracy}</div>
                            <div className="flex items-center justify-center">{data.godzinaZakonczeniaPracy}</div>
                        </div>
                        <div className="text-center text-[9px] mt-1">Ilość godzin pracy kierowcy</div>
                        <LinedText>{data.iloscGodzinPracy}</LinedText>
                    </div>
                    <div className={`col-span-1 border-t-2 border-r ${formColor} flex items-center justify-center font-bold text-xl`}>5</div>
                    <div className={`col-span-11 border-t-2 ${formColor} p-2`}>
                        <Field label="Promień wyjazdu" value="Lokalny" />
                    </div>
                </div>

                {/* Signatures */}
                <div className={`col-span-12 border-t-2 ${formColor} grid grid-cols-12`}>
                    <div className={`col-span-6 border-r ${formColor}`}>
                        <div className="grid grid-cols-6">
                            <div className={`col-span-1 border-r ${formColor} flex items-center justify-center font-bold text-xl`}>6</div>
                            <div className="col-span-5 p-2">
                                <div className="text-[10px]">Pojazd samochodowy sprawny do wyjazdu</div>
                                <LinedText className="mt-4">{data.podpisKierowcySprawny}</LinedText>
                                <div className="text-center text-[8px] mt-1">Podpis kierowcy</div>
                            </div>
                        </div>
                    </div>
                    <div className={`col-span-6`}>
                        <div className="grid grid-cols-6 h-full">
                            <div className={`col-span-1 border-r ${formColor} flex items-center justify-center font-bold text-xl`}>7</div>
                            <div className="col-span-5 p-2 flex items-center">
                                <div className="text-[10px]">Kontrola drogowa</div>
                            </div>
                        </div>
                    </div>
                    <div className={`col-span-12 border-t-2 ${formColor} grid grid-cols-12`}>
                        <div className={`col-span-1 border-r ${formColor} flex items-center justify-center font-bold text-xl`}>8</div>
                        <div className={`col-span-11 grid grid-cols-2`}>
                            <div className={`border-r ${formColor} p-2`}>
                                <div className="text-[10px]">Zleca wyjazd</div>
                                <LinedText className="mt-4">{data.podpisZlecajacegoWyjazd}</LinedText>
                                <div className="text-center text-[8px] mt-1">Podpis</div>
                            </div>
                            <div className="p-2">
                                <div className="text-[10px]">Stwierdza przyjazd</div>
                                <LinedText className="mt-4">{data.podpisStwierdzajacegoPrzyjazd}</LinedText>
                                <div className="text-center text-[8px] mt-1">Podpis</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Fuel Info */}
                <div className={`col-span-12 border-t-2 ${formColor} grid grid-cols-12`}>
                    <div className={`col-span-1 row-span-2 border-r ${formColor} flex items-center justify-center font-bold text-xl`}>9</div>
                    <div className={`col-span-11 text-center font-bold text-sm p-1 border-b ${formColor}`}>PALIWO</div>
                    <div className={`col-span-11 grid grid-cols-6 text-[9px] text-center`}>
                        <div className={`border-r ${formColor} p-1`}>Stan paliwa przy otrzymaniu karty</div>
                        <div className={`col-span-4 border-r ${formColor}`}>
                            <div className={`border-b ${formColor} font-bold`}>Pobrano</div>
                            <div className="grid grid-cols-4">
                                <div className={`border-r ${formColor} p-1`}>Gdzie</div>
                                <div className={`border-r ${formColor} p-1`}>Nr kwitu</div>
                                <div className={`border-r ${formColor} p-1`}>Ilość</div>
                                <div className="p-1">Podpis wydającego</div>
                            </div>
                        </div>
                        <div className="p-1">Stan paliwa przy zwrocie karty</div>
                    </div>
                    <div className={`col-span-12 border-t ${formColor} grid grid-cols-12 h-12`}>
                        <div className={`col-span-1 border-r ${formColor}`}></div>
                        <div className={`col-span-11 grid grid-cols-6 text-[10px] text-center`}>
                            <div className={`border-r ${formColor} flex items-center justify-center font-medium`}>{data.paliwoStanPoczatkowy.toFixed(2)}</div>
                            <div className={`col-span-4 border-r ${formColor} grid grid-cols-4`}>
                                <div className={`border-r ${formColor} flex items-center justify-center`}>{data.paliwoPobrano[0]?.gdzie || <>&nbsp;</>}</div>
                                <div className={`border-r ${formColor} flex items-center justify-center`}>{data.paliwoPobrano[0]?.nrKwitu || <>&nbsp;</>}</div>
                                <div className={`border-r ${formColor} flex items-center justify-center font-medium`}>{data.paliwoPobrano[0] ? data.paliwoPobrano[0].ilosc.toFixed(2) : <>&nbsp;</>}</div>
                                <div className="flex items-center justify-center">&nbsp;</div>
                            </div>
                            <div className="flex items-center justify-center font-medium">{data.paliwoStanKoncowy.toFixed(2)}</div>
                        </div>
                    </div>
                    <div className={`col-span-12 border-t-2 ${formColor} grid grid-cols-12`}>
                        <div className={`col-span-10 p-2 border-r ${formColor}`}>
                            <LinedText className="mt-4">{data.podpisWystawiajacegoKarte}</LinedText>
                            <div className="text-center text-[8px] mt-1">Podpis</div>
                        </div>
                        <div className={`col-span-2 flex items-start justify-center font-bold text-xl pt-2`}>10</div>
                    </div>
                    <div className={`col-span-12 border-t ${formColor} text-center text-[8px] p-1`}>Podpis wystawiającego kartę</div>
                </div>

                {/* Results */}
                <div className={`col-span-12 border-t-2 ${formColor} grid grid-cols-12`}>
                    <div className={`col-span-1 row-span-3 border-r ${formColor}`}></div>
                    <div className={`col-span-3 row-span-2 border-r ${formColor} text-center`}>
                        <div className={`h-1/2 flex items-center justify-center text-[10px] font-bold border-b ${formColor}`}>POWRÓT</div>
                        <div className={`h-1/2 flex items-center justify-center text-[10px] font-bold`}>WYJAZD</div>
                    </div>
                    <div className={`col-span-8 grid grid-cols-8`}>
                        <div className={`col-span-3 border-r ${formColor} text-center text-[10px] font-bold p-1`}>Norma zużycia paliwa na 100km przebiegu</div>
                        <div className={`col-span-4 border-r ${formColor} text-center text-[10px] font-bold p-1`}>Zużycie paliwa</div>
                        <div className={`row-span-3 flex items-center justify-center font-bold text-xl`}>11</div>
                    </div>
                    <div className={`col-span-8 grid grid-cols-8 border-t ${formColor}`}>
                        <div className={`col-span-3 border-r ${formColor} text-center text-[10px] font-medium flex items-center justify-center`}>{data.normaZuzyciaPaliwa.toFixed(2)} l</div>
                        <div className={`col-span-4 border-r ${formColor} grid grid-cols-4 text-center text-[9px]`}>
                            <div className={`border-r ${formColor} p-1`}>wg norm po uwzgl. poprawek</div>
                            <div className={`border-r ${formColor} p-1`}>rzeczywiste</div>
                            <div className={`border-r ${formColor} p-1`}>oszczędność</div>
                            <div className="p-1">przekroczenie</div>
                        </div>
                    </div>
                    <div className={`col-span-12 grid grid-cols-12 border-t ${formColor}`}>
                        <div className={`col-span-1 row-span-2 border-r ${formColor} flex items-center justify-center font-bold text-xl`}>12</div>
                        <div className={`col-span-3 row-span-2 border-r ${formColor} grid grid-cols-3 text-center text-[9px]`}>
                            <div className={`border-r ${formColor} p-1`}>Data</div>
                            <div className={`border-r ${formColor} p-1`}>Godz. - min.</div>
                            <div className="p-1">Stan licznika</div>
                        </div>
                        <div className={`col-span-4 border-r ${formColor} grid grid-cols-4 text-center text-[10px] font-medium h-8`}>
                            <div className={`border-r ${formColor} flex items-center justify-center`}>{data.zuzyciePaliwa.wgNorm.toFixed(2)}</div>
                            <div className={`border-r ${formColor} flex items-center justify-center`}>{data.zuzyciePaliwa.rzeczywiste.toFixed(2)}</div>
                            <div className={`border-r ${formColor} flex items-center justify-center`}>{data.zuzyciePaliwa.oszczednosc.toFixed(2)}</div>
                            <div className="flex items-center justify-center">{data.zuzyciePaliwa.przekroczenie.toFixed(2)}</div>
                        </div>
                        <div className={`col-span-4 row-span-2 border-l ${formColor}`}>
                            <div className={`grid grid-cols-12 h-full`}>
                                <div className={`col-span-10 border-r ${formColor} p-1`}>
                                    <div className="text-center text-[10px] font-bold">WYNIKI</div>
                                    <div className="grid grid-cols-2 text-center text-[9px] mt-1">
                                        <div>Czas pracy godz.-min.</div>
                                        <div>Przebieg km</div>
                                    </div>
                                </div>
                                <div className={`col-span-2 flex items-center justify-center font-bold text-xl`}>14</div>
                            </div>
                        </div>
                    </div>
                    <div className={`col-span-12 grid grid-cols-12 border-t ${formColor}`}>
                        <div className={`col-span-1 row-span-2 border-r ${formColor} flex items-center justify-center font-bold text-xl`}>13</div>
                        <div className={`col-span-3 border-r ${formColor} grid grid-cols-3 text-center text-[10px] font-medium h-8`}>
                            <div className={`border-r ${formColor} flex items-center justify-center`}>{data.powrot.data}</div>
                            <div className={`border-r ${formColor} flex items-center justify-center`}>{data.powrot.godzina}</div>
                            <div className="flex items-center justify-center">{data.powrot.stanLicznika}</div>
                        </div>
                        <div className={`col-span-4 border-r ${formColor} grid grid-cols-2 text-center text-[10px] font-medium h-8`}>
                            <div className={`border-r ${formColor} flex items-center justify-center`}>{data.wyniki.czasPracy}</div>
                            <div className="flex items-center justify-center">{data.wyniki.przebiegKm}</div>
                        </div>
                    </div>
                    <div className={`col-span-12 grid grid-cols-12 border-t ${formColor}`}>
                        <div className={`col-span-3 border-r ${formColor} grid grid-cols-3 text-center text-[10px] font-medium h-8`}>
                            <div className={`border-r ${formColor} flex items-center justify-center`}>{data.wyjazd.data}</div>
                            <div className={`border-r ${formColor} flex items-center justify-center`}>{data.wyjazd.godzina}</div>
                            <div className="flex items-center justify-center">{data.wyjazd.stanLicznika}</div>
                        </div>
                    </div>
                </div>

                {/* Final Signatures */}
                <div className={`col-span-12 border-t-2 ${formColor} grid grid-cols-12 text-[10px]`}>
                    <div className={`col-span-4 border-r ${formColor} p-2`}>
                        <div className="text-center">15 Podpis kierowcy</div>
                        <LinedText className="mt-8">{data.podpisKierowcyWyniki}</LinedText>
                    </div>
                    <div className={`col-span-4 border-r ${formColor} p-2`}>
                        <div className="text-center">16 Wyniki obliczył</div>
                        <LinedText className="mt-8">{data.podpisWynikiObliczyl}</LinedText>
                    </div>
                    <div className={`col-span-4 p-2`}>
                        <div className="text-center">17 Podpis kontr. wyniki</div>
                        <LinedText className="mt-8">{data.podpisKontroliWynikow}</LinedText>
                    </div>
                </div>

                {/* Notes */}
                <div className={`col-span-12 border-t-2 ${formColor} grid grid-cols-12`}>
                    <div className={`col-span-10 border-r ${formColor} p-2`}>
                        <div className="font-bold text-[10px]">18 Uwagi</div>
                        <p className="text-[8px] leading-tight mt-1">
                            W razie niemożności powrotu w tym samym dniu do miejsca stałego postoju, to jest przy dalszych jazdach, dysponujący pojazdem obowiązany jest codziennie odnotować w działce 14 czas, tj. godz. i minutę rozpoczęcia pracy (wyjazdu) i czas ukończenia pracy (przyjazdu). W działce 14 kierowca wpisuje uwagi o stanie technicznym pojazdu samochodowego i przyczep, wydarzenie w drodze, spóźnienia, przestoje, zmianę ogumienia itp.
                        </p>
                    </div>
                    <div className={`col-span-2 p-2`}>
                        <div className="font-bold text-[10px]">19 Deklaracja na dojazd poza promień</div>
                        <Field label="Nr" value="" className="mt-4" />
                    </div>
                </div>
            </div>
        </div>
    );
});
