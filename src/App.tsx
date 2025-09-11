import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, Users, ChevronRight, Award, Shuffle, Undo, Redo, Ticket, ChevronDown, ChevronUp, AlertTriangle, X, Twitter } from 'lucide-react';

// Definiere Typen für die Datenstrukturen
interface Player {
  points: number;
  participating: boolean;
  goldenTicket: boolean;
}

interface Match {
  p1: string | null;
  p2: string | null;
  winner: string | null;
  stage: string;
}

interface Matches {
  [key: number]: Match;
}

interface Placements {
  [key: string]: number;
}

interface HistoryEntry {
  matches: Matches;
  placements: Placements;
  goldenTickets: { [key: string]: boolean };
}

interface PlayerRanking {
  name: string;
  basePoints: number;
  tournamentPoints: number;
  totalPoints: number;
  placement: string | number;
  participating: boolean;
  goldenTicket: boolean;
  rank?: number;
}

const TournamentBracket = () => {
  // Alle Spieler mit ihren Startpunkten (vor diesem Turnier)
  const initialPlayers: { [key: string]: Player } = {
    'CAL Sub': { points: 210, participating: false, goldenTicket: false },
    'Lucas': { points: 200, participating: false, goldenTicket: false },
    'Mohamed Light': { points: 190, participating: true, goldenTicket: true },
    'Adriel': { points: 160, participating: false, goldenTicket: true },
    'Ian77': { points: 150, participating: true, goldenTicket: true },
    'Egor': { points: 125, participating: true, goldenTicket: false },
    'Mugi': { points: 125, participating: true, goldenTicket: false },
    'CAL Pedro': { points: 115, participating: true, goldenTicket: false },
    'SK xopxsam': { points: 110, participating: true, goldenTicket: false },
    'Kitashyan': { points: 100, participating: false, goldenTicket: false },
    'Wallace': { points: 95, participating: false, goldenTicket: false },
    'CAL Sandbox': { points: 90, participating: true, goldenTicket: false },
    'Ardentoas': { points: 90, participating: false, goldenTicket: false },
    'GençAslan:)': { points: 85, participating: false, goldenTicket: false },
    'Viiper': { points: 80, participating: true, goldenTicket: false },
    'Asaf': { points: 15, participating: true, goldenTicket: false },
    'Ryley': { points: 0, participating: true, goldenTicket: false },
    'Sweep': { points: 0, participating: true, goldenTicket: false },
    'Niuzi': { points: 0, participating: true, goldenTicket: false },
  };

  // Punkte für Platzierungen
  const placementPoints: { [key: number]: number } = {
    1: 100,
    2: 90,
    3: 80,
    4: 70,
    5: 60,
    6: 60,
    7: 50,
    8: 50,
    9: 40,
    10: 40,
    11: 40,
    12: 40,
  };

  const [matches, setMatches] = useState<Matches>({});
  const [placements, setPlacements] = useState<Placements>({});
  const [goldenTickets, setGoldenTickets] = useState<{ [key: string]: boolean }>(
    Object.fromEntries(Object.entries(initialPlayers).map(([name, data]) => [name, data.goldenTicket]))
  );
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [sectionVisibility, setSectionVisibility] = useState<{
    upperBracket: boolean;
    lowerBracket: boolean;
    grandFinals: boolean;
    qualifications: boolean;
    leaderboard: boolean;
  }>({
    upperBracket: true,
    lowerBracket: true,
    grandFinals: true,
    qualifications: true,
    leaderboard: true,
  });
  const [showWarning, setShowWarning] = useState<boolean>(true);

  // Toggle-Funktion für Sektionen
  const toggleSection = (section: keyof typeof sectionVisibility) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Initialisiere alle Matches
  useEffect(() => {
    resetTournament();
  }, []);

  // Synchronisiere Warnungs-Sichtbarkeit mit Turnier-Status
  /*
  useEffect(() => {
    setShowWarning(!isTournamentComplete());
  }, [matches]);
*/
  const createInitialMatches = (): Matches => {
    return {
      1: { p1: 'Niuzi', p2: 'Mugi', winner: null, stage: 'UBR1' },
      2: { p1: 'Ian77', p2: 'Asaf', winner: null, stage: 'UBR1' },
      3: { p1: 'Ryley', p2: 'Sweep', winner: null, stage: 'UBR1' },
      4: { p1: 'Viiper', p2: 'CAL Sandbox', winner: null, stage: 'UBR1' },
      5: { p1: 'Mohamed Light', p2: null, winner: null, stage: 'UBR2' },
      6: { p1: 'CAL Pedro', p2: null, winner: null, stage: 'UBR2' },
      7: { p1: 'Egor', p2: null, winner: null, stage: 'UBR2' },
      8: { p1: 'SK xopxsam', p2: null, winner: null, stage: 'UBR2' },
      9: { p1: null, p2: null, winner: null, stage: 'LBR1' },
      10: { p1: null, p2: null, winner: null, stage: 'LBR1' },
      11: { p1: null, p2: null, winner: null, stage: 'LBR1' },
      12: { p1: null, p2: null, winner: null, stage: 'LBR1' },
      13: { p1: null, p2: null, winner: null, stage: 'LBR2' },
      14: { p1: null, p2: null, winner: null, stage: 'LBR2' },
      15: { p1: null, p2: null, winner: null, stage: 'UBR3' },
      16: { p1: null, p2: null, winner: null, stage: 'UBR3' },
      17: { p1: null, p2: null, winner: null, stage: 'LBR3' },
      18: { p1: null, p2: null, winner: null, stage: 'LBR3' },
      19: { p1: null, p2: null, winner: null, stage: 'LBR4' },
      20: { p1: null, p2: null, winner: null, stage: 'UBF' },
      21: { p1: null, p2: null, winner: null, stage: 'LBF' },
      22: { p1: null, p2: null, winner: null, stage: 'GF1' },
      23: { p1: null, p2: null, winner: null, stage: 'GF2' },
    };
  };

  const resetTournament = () => {
    const initialMatches = createInitialMatches();
    setMatches(initialMatches);
    setPlacements({});
    setGoldenTickets(Object.fromEntries(Object.entries(initialPlayers).map(([name, data]) => [name, data.goldenTicket])));
    setHistory([]);
    setHistoryIndex(-1);
    setShowWarning(true);
  };

  const saveToHistory = (newMatches: Matches, newPlacements: Placements, newGoldenTickets: { [key: string]: boolean }) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      matches: JSON.parse(JSON.stringify(newMatches)),
      placements: { ...newPlacements },
      goldenTickets: { ...newGoldenTickets },
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setMatches(JSON.parse(JSON.stringify(prevState.matches)));
      setPlacements({ ...prevState.placements });
      setGoldenTickets({ ...prevState.goldenTickets });
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setMatches(JSON.parse(JSON.stringify(nextState.matches)));
      setPlacements({ ...nextState.placements });
      setGoldenTickets({ ...nextState.goldenTickets });
      setHistoryIndex(historyIndex + 1);
    }
  };

  const findDependentMatches = (matchId: number): number[] => {
    const dependent = new Set<number>();
    const queue = [matchId];

    while (queue.length > 0) {
      const currentId = queue.shift()!;

      Object.entries(matches).forEach(([id, match]) => {
        const numId = parseInt(id);
        if (numId > currentId) {
          const currentMatch = matches[currentId];
          if (
            currentMatch &&
            (match.p1 === currentMatch.p1 ||
              match.p1 === currentMatch.p2 ||
              match.p2 === currentMatch.p1 ||
              match.p2 === currentMatch.p2)
          ) {
            if (!dependent.has(numId)) {
              dependent.add(numId);
              queue.push(numId);
            }
          }
        }
      });
    }

    return Array.from(dependent);
  };

  const resetDependentMatches = (matchId: number, newMatches: Matches): Placements => {
    const dependentIds = findDependentMatches(matchId);
    const newPlacements = { ...placements };

    // Lösche Platzierungen für Spieler in abhängigen Matches
    dependentIds.forEach((id) => {
      const match = newMatches[id];
      if (match) {
        if (match.p1) delete newPlacements[match.p1];
        if (match.p2) delete newPlacements[match.p2];
        if (match.winner) delete newPlacements[match.winner];
      }
    });

    // Setze abhängige Matches zurück
    const playerSource: { [key: number]: { p1Source?: number; p2Source?: number } } = {
      5: { p2Source: 1 },
      6: { p2Source: 2 },
      7: { p2Source: 3 },
      8: { p2Source: 4 },
      15: { p1Source: 5, p2Source: 6 },
      16: { p1Source: 7, p2Source: 8 },
      20: { p1Source: 15, p2Source: 16 },
      9: { p1Source: 5, p2Source: 4 },
      10: { p1Source: 6, p2Source: 3 },
      11: { p1Source: 7, p2Source: 2 },
      12: { p1Source: 8, p2Source: 1 },
      13: { p1Source: 10, p2Source: 9 },
      14: { p1Source: 12, p2Source: 11 },
      17: { p1Source: 15, p2Source: 14 },
      18: { p1Source: 16, p2Source: 13 },
      19: { p1Source: 17, p2Source: 18 },
      21: { p1Source: 20, p2Source: 19 },
      22: { p1Source: 20, p2Source: 21 },
      23: { p1Source: 22, p2Source: 22 },
    };

    const fixedUBR2: Record<number, string> = {
      5: 'Mohamed Light',
      6: 'CAL Pedro',
      7: 'Egor',
      8: 'SK xopxsam',
    };

    dependentIds.forEach((id) => {
      const match = newMatches[id];
      if (match) {
        const sources = playerSource[id] || {};
        const dependentSet = new Set(findDependentMatches(matchId).concat(matchId));

        if (sources.p1Source && dependentSet.has(sources.p1Source)) {
          match.p1 = fixedUBR2[id] || null;
        }
        if (sources.p2Source && dependentSet.has(sources.p2Source)) {
          match.p2 = null;
        }

        if (
          (sources.p1Source && dependentSet.has(sources.p1Source)) ||
          (sources.p2Source && dependentSet.has(sources.p2Source))
        ) {
          match.winner = null;
        }
      }
    });

    return newPlacements;
  };

  const assignGoldenTicket = (newPlacements: Placements, newGoldenTickets: { [key: string]: boolean }) => {
    const winner = Object.keys(newPlacements).find((player) => newPlacements[player] === 1);
    const runnerUp = Object.keys(newPlacements).find((player) => newPlacements[player] === 2);
    const thirdPlace = Object.keys(newPlacements).find((player) => newPlacements[player] === 3);

    if (winner && !newGoldenTickets[winner]) {
      newGoldenTickets[winner] = true;
    } else if (winner && runnerUp && newGoldenTickets[winner] && !newGoldenTickets[runnerUp]) {
      newGoldenTickets[runnerUp] = true;
    } else if (winner && runnerUp && thirdPlace && newGoldenTickets[winner] && newGoldenTickets[runnerUp] && !newGoldenTickets[thirdPlace]) {
      newGoldenTickets[thirdPlace] = true;
    }

    return newGoldenTickets;
  };

  const handleMatchWinner = (matchId: number, winner: string, isReset: boolean = false) => {
    const newMatches: Matches = JSON.parse(JSON.stringify(matches));
    const match = newMatches[matchId];

    let newPlacements: Placements = { ...placements };
    let newGoldenTickets: { [key: string]: boolean } = { ...goldenTickets };

    if (isReset) {
      const dependentIds = findDependentMatches(matchId);
      const affectedPlayers = new Set<string>();
      dependentIds.forEach((id) => {
        const m = newMatches[id];
        if (m) {
          if (m.p1) affectedPlayers.add(m.p1);
          if (m.p2) affectedPlayers.add(m.p2);
          if (m.winner) affectedPlayers.add(m.winner);
        }
      });

      affectedPlayers.forEach((player) => {
        delete newPlacements[player];
      });

      newPlacements = resetDependentMatches(matchId, newMatches);
    }

    match.winner = winner;
    const loser = winner === match.p1 ? match.p2 : match.p1;

    // Typ-Sicherheits-Check
    if (!loser) {
      console.warn(`Kein Verlierer für Match ${matchId}, da p1 oder p2 null ist.`);
      return;
    }

    if (matchId >= 1 && matchId <= 4) {
      newMatches[matchId + 4].p2 = winner;
      const lbMapping: { [key: number]: number } = { 1: 12, 2: 11, 3: 10, 4: 9 };
      newMatches[lbMapping[matchId]].p2 = loser;
    } else if (matchId >= 5 && matchId <= 8) {
      if (matchId === 5 || matchId === 6) {
        if (!newMatches[15].p1) newMatches[15].p1 = winner;
        else newMatches[15].p2 = winner;
      } else {
        if (!newMatches[16].p1) newMatches[16].p1 = winner;
        else newMatches[16].p2 = winner;
      }
      newMatches[matchId + 4].p1 = loser;
    } else if (matchId >= 9 && matchId <= 12) {
      if (matchId === 9 || matchId === 10) {
        if (matchId === 10) newMatches[13].p1 = winner;
        else newMatches[13].p2 = winner;
      } else {
        if (matchId === 12) newMatches[14].p1 = winner;
        else newMatches[14].p2 = winner;
      }
      newPlacements[loser] = 12;
    } else if (matchId === 13 || matchId === 14) {
      if (matchId === 13) newMatches[18].p2 = winner;
      else newMatches[17].p2 = winner;
      newPlacements[loser] = 8;
    } else if (matchId === 15 || matchId === 16) {
      if (!newMatches[20].p1) newMatches[20].p1 = winner;
      else newMatches[20].p2 = winner;
      if (matchId === 15) newMatches[17].p1 = loser;
      else newMatches[18].p1 = loser;
    } else if (matchId === 17 || matchId === 18) {
      if (!newMatches[19].p1) newMatches[19].p1 = winner;
      else newMatches[19].p2 = winner;
      newPlacements[loser] = 5;
    } else if (matchId === 19) {
      newMatches[21].p2 = winner;
      newPlacements[loser] = 4;
    } else if (matchId === 20) {
      newMatches[22].p1 = winner;
      newMatches[21].p1 = loser;
    } else if (matchId === 21) {
      newMatches[22].p2 = winner;
      newPlacements[loser] = 3;
    } else if (matchId === 22) {
      if (winner === match.p1) {
        newPlacements[winner] = 1;
        newPlacements[loser] = 2;
        newGoldenTickets = assignGoldenTicket(newPlacements, newGoldenTickets);
      } else {
        newMatches[23].p1 = match.p1;
        newMatches[23].p2 = match.p2;
      }
    } else if (matchId === 23) {
      newPlacements[winner] = 1;
      newPlacements[loser] = 2;
      newGoldenTickets = assignGoldenTicket(newPlacements, newGoldenTickets);
    }

    setMatches(newMatches);
    setPlacements(newPlacements);
    setGoldenTickets(newGoldenTickets);
    saveToHistory(newMatches, newPlacements, newGoldenTickets);
  };

  const fillRemainingRandom = () => {
    const newMatches: Matches = JSON.parse(JSON.stringify(matches));
    let newPlacements: Placements = { ...placements };
    let newGoldenTickets: { [key: string]: boolean } = { ...goldenTickets };
    let hasChanges = true;

    while (hasChanges) {
      hasChanges = false;

      for (let id = 1; id <= 23; id++) {
        const match = newMatches[id];

        if (id === 23 && (!newMatches[22].winner || newMatches[22].winner === newMatches[22].p1)) {
          continue;
        }

        if (match && match.p1 && match.p2 && !match.winner) {
          const winner = Math.random() < 0.5 ? match.p1 : match.p2;
          match.winner = winner;
          const loser = winner === match.p1 ? match.p2 : match.p1;

          // Typ-Sicherheits-Check
          if (!loser) {
            console.warn(`Kein Verlierer für Match ${id}, da p1 oder p2 null ist.`);
            continue;
          }

          hasChanges = true;

          if (id >= 1 && id <= 4) {
            newMatches[id + 4].p2 = winner;
            const lbMapping: { [key: number]: number } = { 1: 12, 2: 11, 3: 10, 4: 9 };
            newMatches[lbMapping[id]].p2 = loser;
          } else if (id >= 5 && id <= 8) {
            if (id === 5 || id === 6) {
              if (!newMatches[15].p1) newMatches[15].p1 = winner;
              else newMatches[15].p2 = winner;
            } else {
              if (!newMatches[16].p1) newMatches[16].p1 = winner;
              else newMatches[16].p2 = winner;
            }
            newMatches[id + 4].p1 = loser;
          } else if (id >= 9 && id <= 12) {
            if (id === 9 || id === 10) {
              if (id === 10) newMatches[13].p1 = winner;
              else newMatches[13].p2 = winner;
            } else {
              if (id === 12) newMatches[14].p1 = winner;
              else newMatches[14].p2 = winner;
            }
            newPlacements[loser] = 12;
          } else if (id === 13 || id === 14) {
            if (id === 13) newMatches[18].p2 = winner;
            else newMatches[17].p2 = winner;
            newPlacements[loser] = 8;
          } else if (id === 15 || id === 16) {
            if (!newMatches[20].p1) newMatches[20].p1 = winner;
            else newMatches[20].p2 = winner;
            if (id === 15) newMatches[17].p1 = loser;
            else newMatches[18].p1 = loser;
          } else if (id === 17 || id === 18) {
            if (!newMatches[19].p1) newMatches[19].p1 = winner;
            else newMatches[19].p2 = winner;
            newPlacements[loser] = 6;
          } else if (id === 19) {
            newMatches[21].p2 = winner;
            newPlacements[loser] = 4;
          } else if (id === 20) {
            newMatches[22].p1 = winner;
            newMatches[21].p1 = loser;
          } else if (id === 21) {
            newMatches[22].p2 = winner;
            newPlacements[loser] = 3;
          } else if (id === 22) {
            if (winner === match.p1) {
              newPlacements[winner] = 1;
              newPlacements[loser] = 2;
              newGoldenTickets = assignGoldenTicket(newPlacements, newGoldenTickets);
            } else {
              newMatches[23].p1 = match.p1;
              newMatches[23].p2 = match.p2;
            }
          } else if (id === 23) {
            newPlacements[winner] = 1;
            newPlacements[loser] = 2;
            newGoldenTickets = assignGoldenTicket(newPlacements, newGoldenTickets);
          }
        }
      }
    }

    setMatches(newMatches);
    setPlacements(newPlacements);
    setGoldenTickets(newGoldenTickets);
    saveToHistory(newMatches, newPlacements, newGoldenTickets);
  };

  const getCurrentPoints = (): { [key: string]: number } => {
    const points: { [key: string]: number } = {};
    Object.entries(initialPlayers).forEach(([name, data]) => {
      points[name] = data.points + (placementPoints[placements[name]] || 0);
    });
    return points;
  };

  const getRankings = (): PlayerRanking[] => {
    const currentPoints = getCurrentPoints();
    return Object.entries(initialPlayers)
      .map(([name, data]) => ({
        name,
        basePoints: data.points,
        tournamentPoints: placementPoints[placements[name]] || 0,
        totalPoints: currentPoints[name],
        placement: placements[name] || '-',
        participating: data.participating,
        goldenTicket: goldenTickets[name],
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints);
  };

  const isTournamentComplete = () => {
    return matches[22]?.winner !== null || matches[23]?.winner !== null;
  };

  const getQualified = (): PlayerRanking[] => {
    const rankings = getRankings();
    const qualified: PlayerRanking[] = [];

    for (const player of rankings) {
      if (!player.goldenTicket && qualified.length < 6) {
        qualified.push(player);
      }
    }

    return qualified;
  };

  const MatchBox = ({ match, matchId }: { match: Match; matchId: number }) => {
    if (!match) return null;

    const canSelectWinner = match.p1 && match.p2;
    const isGF2 = matchId === 23;
    const shouldShow = !isGF2 || (matches[22]?.winner === matches[22]?.p2);

    if (!shouldShow) return null;

    const getPlayerClass = (player: string | null, isWinner: boolean, isLoser: boolean) => {
      const lowerBracketEliminationMatches = [9, 10, 11, 12, 13, 14, 17, 18, 19, 21, 23];

      if (!player) {
        return 'bg-gray-500 text-gray-300';
      }
      if (lowerBracketEliminationMatches.includes(matchId) && isLoser) {
        return 'bg-pink-950 text-gray-400';
      }
      if (matchId === 22 && isLoser && player === match.p2) {
        return 'bg-pink-950 text-gray-400';
      }
      if (matchId === 22 && isWinner && player === match.p1) {
        return 'tracking-wider uppercase italic font-bold bg-green-600 text-white';
      }
      if (matchId === 23 && isWinner) {
        return 'tracking-wider uppercase italic font-bold bg-green-600 text-white';
      }
      if (isWinner) {
        return 'bg-amber-700 text-white font-semibold';
      }
      if (isLoser) {
        return 'bg-sky-950 text-gray-200';
      }
      return 'bg-sky-800 text-gray-100';
    };

    const isP1Winner = match.winner != null && match.p1 != null && match.winner === match.p1;
    const isP2Winner = match.winner != null && match.p2 != null && match.winner === match.p2;
    const isP1Loser = match.winner != null && match.winner !== match.p1 && match.p1 !== null;
    const isP2Loser = match.winner != null && match.winner !== match.p2 && match.p2 !== null;

    const p1Class = getPlayerClass(match.p1, isP1Winner, isP1Loser);
    const p2Class = getPlayerClass(match.p2, isP2Winner, isP2Loser);

    const hoverClass = canSelectWinner ? 'hover:bg-sky-700 cursor-pointer' : '';

    return (
      <div className="bg-gray-600 rounded-lg shadow-xl p-3 mb-2 border-2 border-gray-400 w-full max-w-64">
        <div className="text-sm font-medium text-gray-200 mb-2">
          Match {matchId} - {match.stage}
        </div>
        <div
          className={`py-2 px-3 rounded mb-1 flex justify-between items-center text-lg ${p1Class} ${hoverClass}`}
          onClick={() => canSelectWinner && match.winner !== match.p1 && handleMatchWinner(matchId, match.p1!, match.winner != null)}
        >
          <span>{match.p1 || 'TBD'}</span>
          {isP1Winner && <Trophy className="w-4 h-4 text-yellow-300" />}
        </div>
        <div
          className={`py-2 px-3 rounded flex justify-between items-center text-lg ${p2Class} ${hoverClass}`}
          onClick={() => canSelectWinner && match.winner !== match.p2 && handleMatchWinner(matchId, match.p2!, match.winner != null)}
        >
          <span>{match.p2 || 'TBD'}</span>
          {isP2Winner && <Trophy className="w-4 h-4 text-yellow-300" />}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-800 p-4">
      <div className="w-full max-w-7xl min-w-[320px] mx-auto">
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-yellow-500" />
              <h1 className="text-3xl font-bold text-white">WHO MAKES WORLDS?</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={undo}
                disabled={historyIndex <= 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  historyIndex > 0
                    ? 'bg-indigo-700 hover:bg-indigo-900 text-white'
                    : 'bg-slate-600 text-gray-200 cursor-not-allowed'
                }`}
              >
                <Undo className="w-4 h-4" />
                Undo
              </button>
              <button
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  historyIndex < history.length - 1
                    ? 'bg-blue-500 hover:bg-blue-600 text-white'
                    : 'bg-slate-500 text-gray-200 cursor-not-allowed'
                }`}
              >
                <Redo className="w-4 h-4" />
                Redo
              </button>
              <button
                onClick={fillRemainingRandom}
                className="flex items-center gap-2 bg-purple-700 hover:bg-purple-900 text-gray-100 px-4 py-2 rounded-lg transition-colors"
              >
                <Shuffle className="w-4 h-4" />
                Zufällig ausfüllen
              </button>
              <button
                onClick={resetTournament}
                className="flex items-center gap-2 bg-red-800 hover:bg-red-900 text-gray-100 px-4 py-2 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>

          {/* Warnung bei unvollständigem Turnier mit X-Button */}
          {!isTournamentComplete() && showWarning && (
            <div className="bg-yellow-600 text-white p-4 rounded-lg mb-6 flex items-center gap-2 relative">
              <AlertTriangle className="w-5 h-5" />
              <span>
                Not all games have been decided yet. The leaderboard and world finals participants are not up to date.
              </span>
              <button
                onClick={() => setShowWarning(false)}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white hover:text-gray-200 p-1"
                aria-label="Warnung schließen"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {/* Upper Bracket */}
            <div className="bg-gray-700 rounded-xl p-4 border-gray-500 w-full">
              <h2
                className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2 cursor-pointer"
                onClick={() => toggleSection('upperBracket')}
              >
                {sectionVisibility.upperBracket ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
                Upper Bracket
              </h2>
              {sectionVisibility.upperBracket && (
                <div className="grid grid-cols-1 md:grid-cols-[repeat(4,minmax(0,1fr))] auto-cols-[minmax(0,1fr)] md:gap-4 lg:gap-12">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-base text-gray-200 mb-2">Round 1</h3>
                    {[1, 2, 3, 4].map((id) => (
                      <MatchBox key={id} match={matches[id]} matchId={id} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-base text-gray-200 mb-2">Quarter Finals</h3>
                    {[5, 6, 7, 8].map((id) => (
                      <MatchBox key={id} match={matches[id]} matchId={id} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-base text-gray-200 mb-0">Semi Finals</h3>
                    <div className="flex-1 flex flex-col justify-center gap-8">
                      <MatchBox match={matches[15]} matchId={15} />
                      <MatchBox match={matches[16]} matchId={16} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-base text-gray-200 mb-2">UB Final</h3>
                    <div className="flex-1 flex items-center">
                      <MatchBox match={matches[20]} matchId={20} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4"></div>

            {/* Lower Bracket */}
            <div className="bg-gray-700 rounded-xl p-4 border-gray-500 w-full">
              <h2
                className="text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2 cursor-pointer"
                onClick={() => toggleSection('lowerBracket')}
              >
                {sectionVisibility.lowerBracket ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
                Lower Bracket
              </h2>
              {sectionVisibility.lowerBracket && (
                <div className="grid grid-cols-1 md:grid-cols-[repeat(5,minmax(0,1fr))] auto-cols-[minmax(0,1fr)] md:gap-4 lg:gap-8">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-base text-gray-200 mb-2">LB Round 1</h3>
                    {[9, 10, 11, 12].map((id) => (
                      <MatchBox key={id} match={matches[id]} matchId={id} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-base text-gray-200 mb-2">LB Round 2</h3>
                    <div className="flex-1 flex flex-col justify-center gap-40">
                      {[13, 14].map((id) => (
                        <MatchBox key={id} match={matches[id]} matchId={id} />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-base text-gray-200 mb-2">LB Round 3</h3>
                    <div className="flex-1 flex flex-col justify-center gap-6">
                      {[17, 18].map((id) => (
                        <MatchBox key={id} match={matches[id]} matchId={id} />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-base text-gray-200 mb-2">LB Round 4</h3>
                    <div className="flex-1 flex items-center">
                      <MatchBox match={matches[19]} matchId={19} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-base text-gray-200 mb-2">LB Final</h3>
                    <div className="flex-1 flex items-center">
                      <MatchBox match={matches[21]} matchId={21} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4"></div>

            {/* Grand Finals */}
            <div className="bg-gray-700 rounded-xl p-4 border-gray-500">
              <h2
                className="text-xl font-bold text-yellow-300 mb-4 flex items-center gap-2 cursor-pointer"
                onClick={() => toggleSection('grandFinals')}
              >
                {sectionVisibility.grandFinals ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronUp className="w-5 h-5" />
                )}
                Grand Finals
              </h2>
              {sectionVisibility.grandFinals && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MatchBox match={matches[22]} matchId={22} />
                  {matches[23]?.p1 && <MatchBox match={matches[23]} matchId={23} />}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4"></div>

            {/* Qualifikations-Übersicht */}
            <div className="bg-gray-700 rounded-xl shadow-2xl p-4 mb-6 border-gray-500 w-full">
              <h2
                className="text-2xl font-bold text-green-300 mb-6 flex items-center gap-2 cursor-pointer"
                onClick={() => toggleSection('qualifications')}
              >
                {sectionVisibility.qualifications ? (
                  <ChevronDown className="w-6 h-6" />
                ) : (
                  <ChevronUp className="w-6 h-6" />
                )}
                Current World Finalists (Top 6)
              </h2>
              {sectionVisibility.qualifications && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-700 rounded-lg p-4 border-gray-500">
                    <h3 className="font-bold text-green-400 mb-3">Qualified via Points</h3>
                    <div className="space-y-2">
                      {getQualified().map((player, index) => (
                        <div key={player.name} className="flex justify-between items-center bg-gray-600 rounded p-2 border-gray-500">
                          <span className="font-medium text-gray-200">
                            {index + 1}. {player.name}
                          </span>
                          <span className="font-bold text-green-400">{player.totalPoints} Pts</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4 border-gray-500">
                    <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                      <Ticket className="w-5 h-5" />
                      Golden Ticket Owners
                    </h3>
                    <div className="space-y-2">
                      {getRankings()
                        .filter((p) => p.goldenTicket)
                        .map((player) => (
                          <div key={player.name} className="flex justify-between items-center bg-gray-600 rounded p-2 border-gray-500">
                            <span className="font-medium text-gray-200">{player.name}</span>
                            <span className="font-bold text-yellow-400">{player.totalPoints} Pts</span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Komplette Rangliste */}
            <div className="bg-gray-700 rounded-xl shadow-2xl p-4 border-gray-500 w-full">
              <h2
                className="text-2xl font-bold text-fuchsia-400 mb-6 flex items-center gap-2 cursor-pointer"
                onClick={() => toggleSection('leaderboard')}
              >
                {sectionVisibility.leaderboard ? (
                  <ChevronDown className="w-6 h-6" />
                ) : (
                  <ChevronUp className="w-6 h-6" />
                )}
                Leaderboard (relevant)
              </h2>
              {sectionVisibility.leaderboard && (
                <div className="overflow-x-auto">
                  <div className="w-full">
                    <div className="space-y-2">
                      <div className="flex bg-gray-700 rounded p-2 border-gray-500">
                        <span className="flex-1 px-4 py-2 text-left text-sm font-semibold text-gray-200">Rank</span>
                        <span className="flex-1 px-4 py-2 text-left text-sm font-semibold text-gray-200">Player</span>
                        <span className="flex-1 px-4 py-2 text-center text-sm font-semibold text-gray-200">Participation</span>
                        <span className="flex-1 px-4 py-2 text-center text-sm font-semibold text-gray-200">Placement</span>
                        <span className="flex-1 px-4 py-2 text-center text-sm font-semibold text-gray-200">Starting Points</span>
                        <span className="flex-1 px-4 py-2 text-center text-sm font-semibold text-gray-200">Tournament Points</span>
                        <span className="flex-1 px-4 py-2 text-center text-sm font-semibold text-gray-200">Total</span>
                        <span className="flex-1 px-4 py-2 text-center text-sm font-semibold text-gray-200">Status</span>
                      </div>
                      {getRankings().map((player, index, rankings) => {
                        const isQualified = getQualified().some((q) => q.name === player.name);
                        return (
                          <div
                            key={player.name}
                            className={`flex items-center bg-gray-600 rounded-lg p-2 border-gray-500 ${
                              player.goldenTicket || isQualified ? 'bg-gray-500' : 'bg-gray-800'
                            }`}
                          >
                            <span className="flex-1 px-4 py-2 font-semibold text-gray-200">{index + 1}</span>
                            <span className="flex-1 px-4 py-2 font-medium flex items-center gap-2 text-gray-200">
                              {player.name}
                              {player.goldenTicket}
                            </span>
                            <span className="flex-1 px-4 py-2 text-center">
                              {player.participating ? (
                                <span className="text-gray-200">Yes</span>
                              ) : (
                                <span className="text-gray-200">No</span>
                              )}
                            </span>
                            <span className="flex-1 px-4 py-2 text-center text-gray-200">
                              {player.placement !== '-' ? (
                                Number(player.placement) === 6 ? '5. – 6.' :
                                Number(player.placement) === 8 ? '7. – 8.' :
                                Number(player.placement) === 12 ? '9. – 12.' :
                                `${player.placement}.`
                              ) : '-'}
                            </span>
                            <span className="flex-1 px-4 py-2 text-center text-gray-200">{player.basePoints}</span>
                            <span className="flex-1 px-4 py-2 text-center text-gray-200">
                              {player.tournamentPoints > 0 ? `+${player.tournamentPoints}` : '-'}
                            </span>
                            <span className="flex-1 px-4 py-2 text-center font-bold text-gray-100">{player.totalPoints}</span>
                            <span className="flex-1 px-4 py-2 text-center">
                              {player.goldenTicket ? (
                                <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                  Golden Ticket
                                </span>
                              ) : isQualified ? (
                                <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                                  Qualified
                                </span>
                              ) : (
                                <span className="bg-gray-600 text-gray-300 px-3 py-1 rounded-full text-xs">
                                  Not qualified
                                </span>
                              )}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Footer mit Name und Twitter-Button */}
            <div className="flex justify-between items-center mt-6 text-gray-300">
              <span className="text-sm">Created by nitramGe</span>
              <a
                href="https://x.com/nitramGe_Felix"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                aria-label="Follow me :)"
              >
                <Twitter className="w-5 h-5" />
                Follow
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;