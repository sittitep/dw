class Book < ApplicationRecord
  validates :title, presence: true, uniqueness: { scope: :author }
  validates :author, presence: true
  validates :year, format: { with: /\A\d{4}\z/ }, numericality: { less_than_or_equal_to: Time.now.year }

  acts_as_taggable_on :tags
end
