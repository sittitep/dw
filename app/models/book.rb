class Book < ApplicationRecord
  validates :title, presence: true, uniqueness: { scope: :author }
  validates :author, presence: true
  validates :year, numericality: true, format: { with: /\A\d{4}\z/ }
end
