-- Full CRUD for authenticated users on core tables (optional; API uses service role which bypasses RLS).
-- These policies allow client-side Supabase client (anon key) to do CRUD when user is authenticated.

-- Customers: allow authenticated users full CRUD
DROP POLICY IF EXISTS "Users can read own data" ON customers;
CREATE POLICY "Allow authenticated read customers" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert customers" ON customers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update customers" ON customers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete customers" ON customers FOR DELETE TO authenticated USING (true);

-- Transactions: full CRUD
DROP POLICY IF EXISTS "Users can read transactions" ON transactions;
CREATE POLICY "Allow authenticated read transactions" ON transactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert transactions" ON transactions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update transactions" ON transactions FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete transactions" ON transactions FOR DELETE TO authenticated USING (true);

-- Alerts: full CRUD
DROP POLICY IF EXISTS "Users can read alerts" ON alerts;
CREATE POLICY "Allow authenticated read alerts" ON alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert alerts" ON alerts FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update alerts" ON alerts FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete alerts" ON alerts FOR DELETE TO authenticated USING (true);
