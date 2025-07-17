// lib/database/arangodb.ts
import { Database } from 'arangojs';

// ArangoDB connection configuration
const config = {
    url: process.env.ARANGO_URL || 'http://localhost:8529',
    databaseName: process.env.ARANGO_DATABASE || 'EVALUATIONRESULTS',
    auth: {
        username: process.env.ARANGO_USERNAME || 'root',
        password: process.env.ARANGO_PASSWORD || 'password'
    }
};

// Create database instance
export const db = new Database(config);

// Set auth and database
db.useBasicAuth(config.auth.username, config.auth.password);
db.userDatabases(config.databaseName);

// Collection references
export const transactionsCollection = db.collection('transactions');

// Interface for ArangoDB transaction document
export interface ArangoTransaction {
    _id: string;
    _key: string;
    _rev: string;
    networkMap: {
        active: boolean;
        cfg: string;
        messages: Array<{
            id: string;
            cfg: string;
            networkMap: {
                active: boolean;
                cfg: string;
            };
            transaction: {
                FIToFIPmtSts: {
                    GrpHdr: {
                        MsgId: string;
                        CreDtTm: string;
                    };
                    TxInfAndSts: {
                        OrgnlInstrId: string;
                        OrgnlEndToEndId: string;
                        TxSts: string;
                        AccptncDtTm: string;
                        InstgAgt: {
                            FinInstnId: {
                                ClrSysMmbId: {
                                    MmbId: string;
                                };
                            };
                        };
                        InstdAgt: {
                            FinInstnId: {
                                ClrSysMmbId: {
                                    MmbId: string;
                                };
                            };
                        };
                        OrgnlTxRef: {
                            Amt: {
                                InstdAmt: {
                                    Ccy: string;
                                    amount: number;
                                };
                            };
                            ReqdExctnDt: string;
                            Dbtr: {
                                Nm: string;
                                Id: {
                                    PrvtId: {
                                        DtAndPlcOfBirth: {
                                            BirthDt: string;
                                            CityOfBirth: string;
                                            CtryOfBirth: string;
                                        };
                                    };
                                };
                            };
                            DbtrAcct: {
                                Id: {
                                    Othr: {
                                        Id: string;
                                    };
                                };
                            };
                            Cdtr: {
                                Nm: string;
                                Id: {
                                    PrvtId: {
                                        DtAndPlcOfBirth: {
                                            BirthDt: string;
                                            CityOfBirth: string;
                                            CtryOfBirth: string;
                                        };
                                    };
                                };
                            };
                            CdtrAcct: {
                                Id: {
                                    Othr: {
                                        Id: string;
                                    };
                                };
                            };
                        };
                    };
                };
            };
            ruleResult: {
                id: string;
                cfg: string;
                subRuleRef: string;
                result: boolean;
                reason?: string;
            };
            metaData: {
                traceParent: string;
                traceState: string;
            };
        }>;
    };
}

// Service class for ArangoDB operations
export class ArangoTransactionService {
    /**
     * Fetch transactions with optional filters
     */
    async getTransactions(filters?: {
        limit?: number;
        offset?: number;
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        searchTerm?: string;
    }): Promise<ArangoTransaction[]> {
        try {
            let query = `
        FOR doc IN transactions
        FILTER doc.networkMap.active == true
      `;

            const bindVars: any = {};

            // Add date filters
            if (filters?.dateFrom) {
                query += ` AND doc.networkMap.messages[0].transaction.FIToFIPmtSts.GrpHdr.CreDtTm >= @dateFrom`;
                bindVars.dateFrom = filters.dateFrom.toISOString();
            }

            if (filters?.dateTo) {
                query += ` AND doc.networkMap.messages[0].transaction.FIToFIPmtSts.GrpHdr.CreDtTm <= @dateTo`;
                bindVars.dateTo = filters.dateTo.toISOString();
            }

            // Add search term filter
            if (filters?.searchTerm) {
                query += ` AND (
          CONTAINS(LOWER(doc._key), LOWER(@searchTerm)) OR
          CONTAINS(LOWER(doc.networkMap.messages[0].transaction.FIToFIPmtSts.TxInfAndSts.OrgnlInstrId), LOWER(@searchTerm)) OR
          CONTAINS(LOWER(doc.networkMap.messages[0].transaction.FIToFIPmtSts.TxInfAndSts.OrgnlEndToEndId), LOWER(@searchTerm))
        )`;
                bindVars.searchTerm = filters.searchTerm;
            }

            // Add status filter
            if (filters?.status && filters.status !== 'all') {
                query += ` AND doc.networkMap.messages[0].transaction.FIToFIPmtSts.TxInfAndSts.TxSts == @status`;
                bindVars.status = filters.status;
            }

            query += `
        SORT doc.networkMap.messages[0].transaction.FIToFIPmtSts.GrpHdr.CreDtTm DESC
        LIMIT @offset, @limit
        RETURN doc
      `;

            bindVars.limit = filters?.limit || 50;
            bindVars.offset = filters?.offset || 0;

            const cursor = await db.query(query, bindVars);
            return await cursor.all();
        } catch (error) {
            console.error('Error fetching transactions from ArangoDB:', error);
            throw error;
        }
    }

    /**
     * Get transaction count for pagination
     */
    async getTransactionCount(filters?: {
        status?: string;
        dateFrom?: Date;
        dateTo?: Date;
        searchTerm?: string;
    }): Promise<number> {
        try {
            let query = `
        FOR doc IN transactions
        FILTER doc.networkMap.active == true
      `;

            const bindVars: any = {};

            // Apply same filters as getTransactions
            if (filters?.dateFrom) {
                query += ` AND doc.networkMap.messages[0].transaction.FIToFIPmtSts.GrpHdr.CreDtTm >= @dateFrom`;
                bindVars.dateFrom = filters.dateFrom.toISOString();
            }

            if (filters?.dateTo) {
                query += ` AND doc.networkMap.messages[0].transaction.FIToFIPmtSts.GrpHdr.CreDtTm <= @dateTo`;
                bindVars.dateTo = filters.dateTo.toISOString();
            }

            if (filters?.searchTerm) {
                query += ` AND (
          CONTAINS(LOWER(doc._key), LOWER(@searchTerm)) OR
          CONTAINS(LOWER(doc.networkMap.messages[0].transaction.FIToFIPmtSts.TxInfAndSts.OrgnlInstrId), LOWER(@searchTerm)) OR
          CONTAINS(LOWER(doc.networkMap.messages[0].transaction.FIToFIPmtSts.TxInfAndSts.OrgnlEndToEndId), LOWER(@searchTerm))
        )`;
                bindVars.searchTerm = filters.searchTerm;
            }

            if (filters?.status && filters.status !== 'all') {
                query += ` AND doc.networkMap.messages[0].transaction.FIToFIPmtSts.TxInfAndSts.TxSts == @status`;
                bindVars.status = filters.status;
            }

            query += ` COLLECT WITH COUNT INTO length RETURN length`;

            const cursor = await db.query(query, bindVars);
            const result = await cursor.next();
            return result || 0;
        } catch (error) {
            console.error('Error getting transaction count from ArangoDB:', error);
            return 0;
        }
    }

    /**
     * Transform ArangoDB document to UI Transaction format
     */
    transformToUITransaction(doc: ArangoTransaction): any {
        const message = doc.networkMap.messages[0];
        const transaction = message.transaction.FIToFIPmtSts;
        const txInfo = transaction.TxInfAndSts;
        const originalTx = txInfo.OrgnlTxRef;

        return {
            id: doc._key,
            timestamp: new Date(transaction.GrpHdr.CreDtTm),
            amount: originalTx.Amt.InstdAmt.amount,
            currency: originalTx.Amt.InstdAmt.Ccy,
            sourceAccount: originalTx.DbtrAcct.Id.Othr.Id,
            destinationAccount: originalTx.CdtrAcct.Id.Othr.Id,
            type: this.determineTransactionType(originalTx),
            status: this.mapTransactionStatus(txInfo.TxSts),
            riskScore: this.calculateRiskScore(message.ruleResult),
            alerts: this.generateAlerts(message.ruleResult),
            // Additional fields for the modal
            customer_id: originalTx.Dbtr.Id.PrvtId.DtAndPlcOfBirth.BirthDt,
            counterparty: originalTx.Cdtr.Nm,
            description: `${originalTx.Dbtr.Nm} to ${originalTx.Cdtr.Nm}`,
            transaction_id: txInfo.OrgnlInstrId,
            ruleResult: message.ruleResult
        };
    }

    private determineTransactionType(originalTx: any): "Credit" | "Debit" | "Transfer" {
        // Logic to determine transaction type based on your business rules
        return "Transfer"; // Default to Transfer for now
    }

    private mapTransactionStatus(status: string): "Pending" | "Completed" | "Flagged" | "Blocked" {
        switch (status?.toUpperCase()) {
            case 'ACCP': return 'Completed';
            case 'PDNG': return 'Pending';
            case 'RJCT': return 'Blocked';
            default: return 'Pending';
        }
    }

    private calculateRiskScore(ruleResult: any): number {
        // Calculate risk score based on rule results
        if (!ruleResult.result) {
            return Math.floor(Math.random() * 40) + 10; // Low risk: 10-50
        }

        // High risk if rule failed
        return Math.floor(Math.random() * 30) + 70; // High risk: 70-100
    }

    private generateAlerts(ruleResult: any): string[] {
        const alerts: string[] = [];

        if (!ruleResult.result) {
            alerts.push(ruleResult.reason || 'Rule evaluation failed');
        }

        if (ruleResult.subRuleRef) {
            alerts.push(`Sub-rule: ${ruleResult.subRuleRef}`);
        }

        return alerts;
    }
}

export const arangoTransactionService = new ArangoTransactionService();