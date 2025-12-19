import {managers,salutations, lastNames,firstNames, risks, objectives, capacityOfLoss} from "@/app/clients/clientData";

export type Client = {
    id: string
    firstName: string
    lastName: string
    investmentManager?: string | null
    knowledgeExperience: string //"Low" | "Medium" | "High"
    lossPct: number
    accountNumber: string
    salutation?: string | null
    objective: string //"Balance" | "Growth" | "Income"
    risk: string //"Low" | "Medium" | "High"
    email?: string | null
    phone?: string | null
    address?: string | null
}

export type ClientList = { items: Client[]; total: number }

// 9 clients covering all combinations of Objective x Risk
//const objectives: Client["objective"][] = ["Balance", "Growth", "Income"]
//const risks: Client["risk"][] = ["Low", "Medium", "High"]

export const MOCK_CLIENTS: ClientList = (() => {
    const items: Client[] = []
    let i = 0
    while (i < 100) {
            const last = lastNames[i % lastNames.length]
            const first = firstNames[i % firstNames.length]
            const clientObj = objectives[i % objectives.length]
            const clientRisk = risks[i % risks.length]
            const cOfLoss = capacityOfLoss[i % capacityOfLoss.length]

            items.push({
                id: `c${i}`,
                firstName: first,
                lastName: last,
                investmentManager: managers[i % managers.length],
                knowledgeExperience: risks[i % risks.length], // just to vary
                lossPct: cOfLoss, //(i * 5) % 35, // 5,10,15,...
                accountNumber: `AC-${100000 + i}`,
                salutation: salutations[i % salutations.length],
                objective: clientObj,
                risk: clientRisk,
                email: `client${i}@example.com`,
                phone: `+44 20 7946 ${1000 + i}`,
                address: `${i} High Street, London`,
            })
            i++

    }
    return { items, total: items.length }
})()