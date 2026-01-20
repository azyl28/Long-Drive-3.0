
import React from 'react';

interface PolecenieWyjazduData {
    nrZlecenia: string;
    nazwiskoJadacego: string;
    trasa: {
        skadDokad: string;
        odjazdData: string;
        odjazdGodz: string;
        przyjazdData: string;
        przyjazdGodz: string;
        stanLicznikaPrzyWyjezdzie: number;
        stanLicznikaPoPowrocie: number;
        przebiegKm: number;
    };
    podpisJadacego: string;
    zuzyciePaliwaWgNorm: number;
    wyjazdPortier: { godzina: string; podpis: string };
    wjazdPortier: { godzina: string; podpis: string };
}

interface PolecenieWyjazduProps {
    data: PolecenieWyjazduData;
}

export const PolecenieWyjazdu = React.forwardRef<HTMLDivElement, PolecenieWyjazduProps>(({ data }, ref) => {
    const Cell: React.FC<{ children: React.ReactNode; className?: string; colSpan?: number }> = ({ children, className = '', colSpan }) => (
        <td colSpan={colSpan} className={`border border-teal-600 p-1 text-center text-[10px] ${className}`}>{children}</td>
    );
    const HeaderCell: React.FC<{ children: React.ReactNode; className?: string; colSpan?: number }> = ({ children, className = '', colSpan }) => (
        <th colSpan={colSpan} className={`border border-teal-600 p-1 text-center text-[9px] font-semibold bg-teal-100 ${className}`}>{children}</th>
    );
    const emptyRows = Array.from({ length: 10 });

    return (
        <div ref={ref} className="p-4 bg-white">
            <div className="w-[700px] text-gray-800">
                <h1 className="text-xl font-bold text-center mb-4">POLECENIE WYJAZDU SŁUŻBOWEGO</h1>
                <table className="w-full border-collapse border-2 border-teal-600">
                    <thead>
                        <tr>
                            <HeaderCell className="w-[4%]">Nr kolejny zlecenia</HeaderCell>
                            <HeaderCell className="w-[12%]">Nazwisko jadącego</HeaderCell>
                            <HeaderCell className="w-[20%]">Skąd - dokąd</HeaderCell>
                            <HeaderCell colSpan={2}>Odjazd</HeaderCell>
                            <HeaderCell colSpan={2}>Przyjazd</HeaderCell>
                            <HeaderCell>Stan licznika przy powrocie</HeaderCell>
                            <HeaderCell>Przebieg km</HeaderCell>
                            <HeaderCell>Podpis jadącego</HeaderCell>
                            <HeaderCell>Poprawki do norm. zużycia paliwa %</HeaderCell>
                            <HeaderCell>Zużycie paliwa wg norm po uwzględnieniu poprawek</HeaderCell>
                        </tr>
                        <tr>
                            <HeaderCell></HeaderCell><HeaderCell></HeaderCell><HeaderCell></HeaderCell>
                            <HeaderCell className="w-[7%]">godz.</HeaderCell>
                            <HeaderCell className="w-[7%]">min.</HeaderCell>
                            <HeaderCell className="w-[7%]">godz.</HeaderCell>
                            <HeaderCell className="w-[7%]">min.</HeaderCell>
                            <HeaderCell>Stan licznika przy wyjeździe</HeaderCell>
                            <HeaderCell></HeaderCell><HeaderCell></HeaderCell><HeaderCell>+ -</HeaderCell><HeaderCell></HeaderCell>
                        </tr>
                        <tr>
                            <HeaderCell>1</HeaderCell><HeaderCell>2</HeaderCell><HeaderCell>3</HeaderCell><HeaderCell>4</HeaderCell><HeaderCell></HeaderCell><HeaderCell>5</HeaderCell><HeaderCell></HeaderCell><HeaderCell>6</HeaderCell><HeaderCell>7</HeaderCell><HeaderCell>8</HeaderCell><HeaderCell>9</HeaderCell><HeaderCell>10</HeaderCell>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="h-8">
                            <Cell>{data.nrZlecenia}</Cell>
                            <Cell>{data.nazwiskoJadacego}</Cell>
                            <Cell>{data.trasa.skadDokad}</Cell>
                            <Cell>{data.trasa.odjazdGodz.split(':')[0]}</Cell>
                            <Cell>{data.trasa.odjazdGodz.split(':')[1]}</Cell>
                            <Cell>{data.trasa.przyjazdGodz.split(':')[0]}</Cell>
                            <Cell>{data.trasa.przyjazdGodz.split(':')[1]}</Cell>
                            <Cell>{data.trasa.stanLicznikaPoPowrocie}</Cell>
                            <Cell>{data.trasa.przebiegKm}</Cell>
                            <Cell>{data.podpisJadacego}</Cell>
                            <Cell></Cell>
                            <Cell>{data.zuzyciePaliwaWgNorm.toFixed(2)}</Cell>
                        </tr>
                        <tr className="h-8">
                            <Cell></Cell><Cell></Cell><Cell></Cell>
                            <Cell colSpan={2} className="text-left pl-2 text-[8px]">Data: {data.trasa.odjazdData}</Cell>
                            <Cell colSpan={2} className="text-left pl-2 text-[8px]">Data: {data.trasa.przyjazdData}</Cell>
                            <Cell>{data.trasa.stanLicznikaPrzyWyjezdzie}</Cell>
                            <Cell></Cell><Cell></Cell><Cell></Cell><Cell></Cell>
                        </tr>
                        {emptyRows.map((_, index) => (
                            <React.Fragment key={index}>
                                <tr className="h-8">
                                    <Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell>
                                </tr>
                                <tr className="h-8">
                                    <Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell colSpan={2}>&nbsp;</Cell><Cell colSpan={2}>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell><Cell>&nbsp;</Cell>
                                </tr>
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="border-2 border-teal-600 p-2">
                        <h2 className="text-center font-bold text-lg mb-2">WYJAZD</h2>
                        <p className="text-sm">Stan licznika: <span className="font-mono">{data.trasa.stanLicznikaPrzyWyjezdzie}</span> km</p>
                        <p className="text-sm">Godzina: <span className="font-mono">{data.wyjazdPortier.godzina}</span></p>
                        <div className="mt-8">
                            <div className="border-t border-dotted border-gray-500 w-full"></div>
                            <p className="text-center text-xs mt-1">Podpis portiera</p>
                        </div>
                    </div>
                    <div className="border-2 border-teal-600 p-2">
                        <h2 className="text-center font-bold text-lg mb-2">WJAZD</h2>
                        <p className="text-sm">Stan licznika: <span className="font-mono">{data.trasa.stanLicznikaPoPowrocie}</span> km</p>
                        <p className="text-sm">Godzina: <span className="font-mono">{data.wjazdPortier.godzina}</span></p>
                        <div className="mt-8">
                            <div className="border-t border-dotted border-gray-500 w-full"></div>
                            <p className="text-center text-xs mt-1">Podpis portiera</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});
