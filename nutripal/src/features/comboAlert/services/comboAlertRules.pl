% comboAlertRules.pl
% Combo-pair type lookup rules for Feature 3: Food Combination Alert
% Facts are asserted at query time from comboAlertPairs.json

% Bidirectional lookup: combo_type(A, B, Type) succeeds if either order matches
combo_type(A, B, Type) :- combo_pair(A, B, Type).
combo_type(A, B, Type) :- combo_pair(B, A, Type).
